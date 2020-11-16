import CPU from './cpu'
import Bus from '../bus/index'
import asm from './assembler/index'

describe('CPU', () => {
  const a6502 = ([str]) => asm(str)

  describe('when connected to bus', () => {
    it('should be able to connect to bus', () => {
      const cpu = new CPU(a6502`BRK`)
      const bus = new Bus(cpu)

      expect(cpu.bus).toBe(bus)
    })
  })

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

  describe('interrupt', () => {
    let cpu

    beforeEach(() => {
      cpu = new CPU(a6502`BRK`)
      cpu.ram[0xfffa] = 0x34
      cpu.ram[0xfffb] = 0x12
      cpu.ram[0xfffc] = 0x34
      cpu.ram[0xfffd] = 0x00
      cpu.ram[0xfffe] = 0x78
      cpu.ram[0xffff] = 0x56
      cpu.reset()
    })

    it('should save old PC to stack', () => {
      const oldSP = cpu.registers.SP
      cpu.interrupt(0xfffe)
      expect(cpu.ram[0x100 + oldSP]).toBe(0x00)
      expect(cpu.ram[0x100 + oldSP - 1]).toBe(0x34)
    })

    it('should save various flags accordingly', () => {
      cpu.interrupt(0xfffe)
      expect(cpu.registers.STATUS.B).toBe(false)
      expect(cpu.registers.STATUS.U).toBe(true)
      expect(cpu.registers.STATUS.I).toBe(true)
    })

    it('should save status register to stack', () => {
      const oldSP = cpu.registers.SP
      cpu.registers.STATUS.status = 0b11111111
      cpu.interrupt(0xfffe)

      expect(cpu.ram[0x100 + oldSP - 2]).toBe(0b11101111)
    })

    describe('nmi', () => {
      it('should change PC to addressing in 0xFFFA & 0xFFFB', () => {
        cpu.nmi()
        expect(cpu.registers.PC).toBe(0x1234)
      })
    })

    describe('irq', () => {
      it('should change PC to addressing in 0xFFFE & 0xFFFF if flag I is set', () => {
        cpu.registers.STATUS.I = true
        cpu.irq()
        expect(cpu.registers.PC).toBe(0x5678)
      })

      it('should not change PC if flag I is not set', () => {
        cpu.registers.STATUS.I = false
        cpu.irq()
        expect(cpu.registers.PC).toBe(0x0034)
      })
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
