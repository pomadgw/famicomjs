import CPU from './cpu'
import assemblerGenerator from './assembler/index'

describe('CPU', () => {
  const a6502 = assemblerGenerator({ memorySize: 0x10000, PC: 0 })

  describe('when reset', () => {
    let cpu

    beforeAll(() => {
      cpu = new CPU(a6502`BRK`)
      cpu.registers.A = 0x10
      cpu.registers.X = 0x10
      cpu.registers.Y = 0x10
      cpu.registers.SP = 0xf0
      cpu.ram[0xfffc] = 0x34
      cpu.ram[0xfffd] = 0x12

      cpu.reset()
    })

    it('should set stack pointer to 0xfd', () => {
      expect(cpu.registers.SP).toBe(0xfd)
    })

    it('should reset register (A, X, Y) to zero', () => {
      expect(cpu.registers.A).toBe(0)
      expect(cpu.registers.X).toBe(0)
      expect(cpu.registers.Y).toBe(0)
    })

    it('should reset status register', () => {
      expect(+cpu.registers.STATUS).toBe(1 << 5)
    })

    it('should set PC register to address in 0xFFFC & 0xFFFD', () => {
      expect(cpu.registers.PC).toBe(0x1234)
    })
  })

  it('should be able to execute correctly (zero page)', () => {
    // LDA $F0
    // operator: LDA, addressing mode: zero page
    // const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
    const cpu = new CPU(a6502`LDA $F0`)
    // cpu.ram[0x00] = 0xa5
    // cpu.ram[0x01] = 0xf0
    cpu.ram[0xf0] = 0x79

    cpu.clock()

    expect(cpu.registers.A).toBe(0x79)
  })

  it('should be able to execute correctly (indexed zero page, register X)', () => {
    // LDA $F0,X
    // operator: LDA, addressing mode: zero page, X
    const cpu = new CPU(a6502`LDA $F0,X`)

    cpu.ram[0xf1] = 0x79
    cpu.registers.X = 0x01

    cpu.clock()

    expect(cpu.registers.A).toBe(0x79)
  })

  it('should be able to execute correctly (indexed zero page, register Y)', () => {
    // LDX $F0,Y
    // operator: LDX, addressing mode: zero page, Y
    const cpu = new CPU(a6502`LDX $F0,Y`)

    cpu.ram[0xf1] = 0x79
    cpu.registers.Y = 0x01

    cpu.clock()

    expect(cpu.registers.X).toBe(0x79)
  })

  it('should be able to execute correctly (absolute)', () => {
    // LDA $1000
    // operator: LDA, addressing mode: absolute
    const cpu = new CPU(a6502`LDA $1000`)
    cpu.ram[0x1000] = 0x05

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05)
  })

  it('should be able to execute correctly (indexed absolute, register X)', () => {
    // LDA $1000,X
    // operator: LDA, addressing mode: absolute, X
    const cpu = new CPU(a6502`LDA $1000,X`)
    cpu.ram[0x1001] = 0x05
    cpu.registers.X = 0x01

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05)
  })

  it('should be able to execute correctly (indexed absolute, register Y)', () => {
    // LDA $1000,Y
    // operator: LDA, addressing mode: absolute, Y
    const cpu = new CPU(a6502`LDA $1000,Y`)
    cpu.ram[0x1001] = 0x05
    cpu.registers.Y = 0x01

    cpu.clock()

    expect(cpu.registers.A).toBe(0x05)
  })

  it('should be able to execute correctly (immediate)', () => {
    // LDA #$FF
    // operator: LDA, addressing mode: immediate
    const cpu = new CPU(a6502`LDA #$FF`)

    cpu.clock()

    expect(cpu.registers.A).toBe(0xff)
  })

  it('should be able to execute correctly (indexed indirect)', () => {
    // LDA ($B0,X)
    // operator: LDA, addressing mode: indexed indirect (IZX)
    const cpu = new CPU(a6502`LDA ($B0,X)`)

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
    const cpu = new CPU(a6502`LDA ($B1),Y`)

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
    const cpu = new CPU(a6502`JMP ($1234)`)

    cpu.ram[0x1234] = 0x00
    cpu.ram[0x1235] = 0x10

    cpu.clock()

    expect(cpu.registers.PC).toBe(0x1000)
  })
})
