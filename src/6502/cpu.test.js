import CPU from './cpu'

describe('CPU', () => {
  it('should be able to execute correctly (zero page)', () => {
    // ORA $00
    // operator: ORA, addressing mode: zero page
    const cpu = new CPU([0x05, 0x00])

    cpu.registers.A = 0x02

    cpu.clock()

    expect(cpu.registers.A).toBe(0x02 | 0x05)
  })

  it('should be able to execute correctly (indexed zero page, register X)', () => {
    // ORA $00,X
    // operator: ORA, addressing mode: zero page, X
    const cpu = new CPU([0x15, 0x00, 0x01])

    cpu.registers.A = 0x02
    cpu.registers.X = 0x02

    cpu.clock()

    expect(cpu.registers.A).toBe(0x02 | 0x01)
  })

  it('should be able to execute correctly (absolute)', () => {
    // ORA $1000
    // operator: ORA, addressing mode: absolute
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0] = 0x0d
    cpu.ram[1] = 0x00
    cpu.ram[2] = 0x10
    cpu.ram[0x1000] = 0x05

    cpu.registers.A = 0x02

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05 | 0x02)
  })

  it('should be able to execute correctly (immediate)', () => {
    // ORA #10
    // operator: ORA, addressing mode: immediate
    const cpu = new CPU([0x09, 0x10])

    cpu.registers.A = 0x02

    cpu.clock()

    expect(cpu.registers.A).toBe(0x02 | 0x10)
  })
})
