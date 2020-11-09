import createNES from '../../index'

const CPU = (ram) => {
  const bus = createNES()
  bus.ram = ram

  return bus.cpu
}

describe('6502 CPU (wasm): addressing mode: indirect', () => {
  it('should return correct value for specified constant', () => {
    const ram = [0x02, 0x00, 0x03, 0x04, 0, 0]
    const CPUDummy = CPU(ram)
    CPUDummy.indMode()
    expect(CPUDummy.absoluteAddress).toBe(0x0403)
    expect(CPUDummy.clocks).toBe(0)
  })

  it('should return correct value for constant ending with LSB 0xff', () => {
    const ram = [...new Array(2 * 1024)].map((_) => 0)
    ram[0] = 0xff
    ram[1] = 0x10
    ram[0x10ff] = 0x10
    ram[0x1000] = 0x10

    // bug in JMP instruction resulting in
    // pointer of MSB from 0x1000 (instead of 0x1100) nad LSB 0x10FF

    const CPUDummy = CPU(ram)
    CPUDummy.indMode()
    expect(CPUDummy.absoluteAddress).toBe(0x1010)
  })
})
