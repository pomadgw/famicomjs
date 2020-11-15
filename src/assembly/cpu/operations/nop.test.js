import createBus from '../../index'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

describe('instruction: NOP', () => {
  it('should return 0 cycles', () => {
    const cpu = CPU([0])

    cpu.NOP()
    expect(cpu.clocks).toBe(0)
  })

  it('should return 1 cycles for certain opcodes', () => {
    const cpu = CPU([0])

    ;[0x1c, 0x3c, 0x5c, 0x7c, 0xdc, 0xfc].forEach((opcode) => {
      cpu.clocks = 0
      cpu.opcode = opcode
      cpu.NOP()

      expect(cpu.clocks).toBe(1)
    })
  })
})
