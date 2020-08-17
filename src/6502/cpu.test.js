import CPU from './cpu'

describe('CPU', () => {
  it('should be able to execute correctly', () => {
    const cpu = new CPU([0x05, 0x00])

    cpu.registers.A = 0x02

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05 | 0x02)
  })
})
