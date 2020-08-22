import CPU from './cpu'

describe('CPU', () => {
  it('should be able to execute correctly (zero page)', () => {
    // LDA $F0
    // operator: LDA, addressing mode: zero page
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0xa5
    cpu.ram[0x01] = 0xf0
    cpu.ram[0xf0] = 0x79

    cpu.clock()

    expect(cpu.registers.A).toBe(0x79)
  })

  it('should be able to execute correctly (indexed zero page, register X)', () => {
    // LDA $F0,X
    // operator: LDA, addressing mode: zero page, X
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))

    cpu.ram[0x00] = 0xb5
    cpu.ram[0x01] = 0xf0
    cpu.ram[0xf1] = 0x79
    cpu.registers.X = 0x01

    cpu.clock()

    expect(cpu.registers.A).toBe(0x79)
  })

  it('should be able to execute correctly (indexed zero page, register Y)', () => {
    // LDX $F0,Y
    // operator: LDX, addressing mode: zero page, Y
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))

    cpu.ram[0x00] = 0xb6
    cpu.ram[0x01] = 0xf0
    cpu.ram[0xf1] = 0x79
    cpu.registers.Y = 0x01

    cpu.clock()

    expect(cpu.registers.X).toBe(0x79)
  })

  it('should be able to execute correctly (absolute)', () => {
    // LDA $1000
    // operator: LDA, addressing mode: absolute
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0xad
    cpu.ram[0x01] = 0x00
    cpu.ram[0x02] = 0x10
    cpu.ram[0x1000] = 0x05

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05)
  })

  it('should be able to execute correctly (indexed absolute, register X)', () => {
    // LDA $1000,X
    // operator: LDA, addressing mode: absolute, X
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0xbd
    cpu.ram[0x01] = 0x00
    cpu.ram[0x02] = 0x10
    cpu.ram[0x1001] = 0x05
    cpu.registers.X = 0x01

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05)
  })

  it('should be able to execute correctly (indexed absolute, register Y)', () => {
    // LDA $1000,Y
    // operator: LDA, addressing mode: absolute, Y
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0xb9
    cpu.ram[0x01] = 0x00
    cpu.ram[0x02] = 0x10
    cpu.ram[0x1001] = 0x05
    cpu.registers.Y = 0x01

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05)
  })

  it('should be able to execute correctly (immediate)', () => {
    // LDA #$FF
    // operator: LDA, addressing mode: immediate
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0xa9
    cpu.ram[0x01] = 0xff

    cpu.clock()

    expect(cpu.registers.A).toBe(0xff)
  })

  it('should be able to execute correctly (indexed indirect)', () => {
    // LDA ($B1,X)
    // operator: LDA, addressing mode: indexed indirect (IZX)
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0xa1
    cpu.ram[0x01] = 0xb0

    cpu.ram[0xb2] = 0x00
    cpu.ram[0xb3] = 0x10

    cpu.ram[0x1000] = 0x05
    cpu.registers.X = 0x02

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05)
  })

  it('should be able to execute correctly (indirect indexed)', () => {
    // LDA ($B1),Y
    // operator: LDA, addressing mode: indirect indexed (IZY)
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0xb1
    cpu.ram[0x01] = 0xb1

    cpu.ram[0xb1] = 0x00
    cpu.ram[0xb2] = 0x10

    cpu.ram[0x100f] = 0x05
    cpu.registers.Y = 0x0f

    cpu.clock()

    expect(cpu.registers.A).toBe(0x5)
  })

  it('should be able to execute correctly (indirect)', () => {
    // JMP ($1234)
    // operator: JMP, addressing mode: indirect
    const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    cpu.ram[0x00] = 0x6c
    cpu.ram[0x01] = 0x34
    cpu.ram[0x02] = 0x12

    cpu.ram[0x1234] = 0x00
    cpu.ram[0x1235] = 0x10

    cpu.clock()

    expect(cpu.registers.PC).toBe(0x1000)
  })
})
