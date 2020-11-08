import createNES from '../../index'

const CPU = (ram) => {
  const bus = createNES()
  bus.ram = ram

  return bus.cpu
}

describe('6502 CPU (wasm): addressing mode: indexed indirect', () => {
  it('should return correct value for absolute address', () => {
    // LDA ($01,X)
    // ram[$01] value: 0x01
    // Register X value: 0x02
    // Address of LSB of target: ram[0x01 + 0x02] = ram[0x03]
    // Address of MSB of target: ram[0x01 + 0x02 + 1] = ram[0x04]
    const ram = [0x00, 0x01, 0x00, 0x00, 0xf0]
    const CPUDummy = CPU(ram)
    CPUDummy.nextPC()
    CPUDummy.X = 0x02
    CPUDummy.inxMode()
    expect(CPUDummy.absoluteAddress).toBe(0xf000)
    expect(CPUDummy.clocks).toBe(0)
  })
})
