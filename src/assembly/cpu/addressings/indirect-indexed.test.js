import createNES from '../../index'

const CPU = (ram) => {
  const bus = createNES()
  bus.ram = ram

  return bus.cpu
}

describe('6502 CPU (wasm): addressing mode: indirect indexed', () => {
  it('should return correct value for absolute address', () => {
    // LDA ($01),Y
    // LSB of target address: ram[$01] value: 0x01
    // MSB of target address: ram[$01 + 1] value: 0x02
    // Register Y value: 0x02
    // Target address: 0x0201 + 0x02 = 0x0203
    const ram = [0x00, 0x01, 0x02, 0xf0, 0x00]
    const CPUDummy = CPU(ram)
    CPUDummy.nextPC()
    CPUDummy.Y = 0x02
    CPUDummy.izyMode()
    expect(CPUDummy.absoluteAddress).toBe(0x0203)
    expect(CPUDummy.clocks).toBe(0)
  })

  it('should return additional cycles if page is changed', () => {
    // LDA ($01),Y
    // LSB of target address: ram[$01] value: 0x01
    // MSB of target address: ram[$01 + 1] value: 0x02
    // Register Y value: 0xff
    // Target address: 0x0201 + 0xff = 0x0300
    const ram = [0x00, 0x01, 0x02, 0xf0, 0x00]
    const CPUDummy = CPU(ram)
    CPUDummy.nextPC()
    CPUDummy.Y = 0xff
    CPUDummy.izyMode()
    expect(CPUDummy.absoluteAddress).toBe(0x0300)
    expect(CPUDummy.clocks).toBe(1)
  })

  it('should wrap value', () => {
    // LDA ($01),Y
    // LSB of target address: ram[$01] value: 0x01
    // MSB of target address: ram[$01 + 1] value: 0xff
    // Register Y value: 0xff
    // Target address: 0xff01 + 0xff = 0x0000
    const ram = [0x00, 0x01, 0xff, 0xf0, 0x00]
    const CPUDummy = CPU(ram)
    CPUDummy.nextPC()
    CPUDummy.Y = 0xff
    CPUDummy.izyMode()
    expect(CPUDummy.absoluteAddress).toBe(0x0000)
  })
})
