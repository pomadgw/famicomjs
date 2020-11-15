import CPU from './index'
import { Flags } from './flags'
import createBus from './createbus'
import Bus from '../bus/index'
import assemblerGenerator from '../6502/assembler/index'

describe('CPU', () => {
  const a6502 = assemblerGenerator({ memorySize: 0x10000, PC: 0 })

  describe('when connected to bus', () => {
    it('should be able to connect to bus', () => {
      const cpu = new CPU()
      const bus = new Bus(cpu)

      expect(cpu.bus).toBe(bus)
    })
  })

  describe('when reset', () => {
    let cpu

    beforeAll(() => {
      const bus = createBus()
      bus.ram = a6502`BRK`
      cpu = bus.cpu
      cpu.A = 0x10
      cpu.X = 0x10
      cpu.Y = 0x10
      cpu.SP = 0xf0
      cpu.write(0xfffc, 0x34)
      cpu.write(0xfffd, 0x12)

      cpu.reset()
    })

    it('should set stack pointer to 0xfd', () => {
      expect(cpu.SP).toBe(0xfd)
    })

    it('should reset register (A, X, Y) to zero', () => {
      expect(cpu.A).toBe(0)
      expect(cpu.X).toBe(0)
      expect(cpu.Y).toBe(0)
    })

    it('should reset status register', () => {
      expect(+cpu.STATUS).toBe(0x24)
    })

    it('should set PC register to address in 0xFFFC & 0xFFFD', () => {
      expect(cpu.PC).toBe(0x1234)
    })
  })

  describe('interrupt', () => {
    let cpu

    beforeEach(() => {
      const bus = createBus()
      bus.ram = a6502`BRK`
      cpu = bus.cpu
      cpu.write(0xfffa, 0x34)
      cpu.write(0xfffb, 0x12)
      cpu.write(0xfffc, 0x34)
      cpu.write(0xfffd, 0x00)
      cpu.write(0xfffe, 0x78)
      cpu.write(0xffff, 0x56)
      cpu.reset()
    })

    it('should save old PC to stack', () => {
      const oldSP = cpu.SP
      cpu.interrupt(0xfffe)
      expect(cpu.read(0x100 + oldSP)).toBe(0x00)
      expect(cpu.read(0x100 + oldSP - 1)).toBe(0x34)
    })

    it('should save various flags accordingly', () => {
      cpu.interrupt(0xfffe)
      expect(cpu.STATUS.getStatus(Flags.B)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.U)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.I)).toBe(true)
    })

    it('should save status register to stack', () => {
      const oldSP = cpu.SP
      cpu.STATUS.status = 0b11111111
      cpu.interrupt(0xfffe)

      expect(cpu.read(0x100 + oldSP - 2)).toBe(0b11101111)
    })

    describe('nmi', () => {
      it('should change PC to addressing in 0xFFFA & 0xFFFB', () => {
        cpu.nmi()
        expect(cpu.PC).toBe(0x1234)
      })
    })

    describe('irq', () => {
      it('should change PC to addressing in 0xFFFE & 0xFFFF if flag I is set', () => {
        cpu.STATUS.setStatus(Flags.I, true)
        cpu.irq()
        expect(cpu.PC).toBe(0x5678)
      })

      it('should not change PC if flag I is not set', () => {
        cpu.STATUS.setStatus(Flags.I, false)
        cpu.irq()
        expect(cpu.PC).toBe(0x0034)
      })
    })
  })

  it('should be able to execute correctly (zero page)', () => {
    // LDA $F0
    // operator: LDA, addressing mode: zero page
    // const bus = createBus()
    // bus.ram = [...new Array(0x2000)].map((_) => 0)
    // cpu = bus.cpu
    const bus = createBus()
    bus.ram = a6502`LDA $F0`
    const cpu = bus.cpu
    // cpu.write(0x00, 0xa5)
    // cpu.write(0x01, 0xf0)
    cpu.write(0xf0, 0x79)

    cpu.clock()

    expect(cpu.A).toBe(0x79)
  })

  it('should be able to execute correctly (indexed zero page, register X)', () => {
    // LDA $F0,X
    // operator: LDA, addressing mode: zero page, X
    const bus = createBus()
    bus.ram = a6502`LDA $F0,X`
    const cpu = bus.cpu

    cpu.write(0xf1, 0x79)
    cpu.X = 0x01

    cpu.clock()

    expect(cpu.A).toBe(0x79)
  })

  it('should be able to execute correctly (indexed zero page, register Y)', () => {
    // LDX $F0,Y
    // operator: LDX, addressing mode: zero page, Y
    const bus = createBus()
    bus.ram = a6502`LDX $F0,Y`
    const cpu = bus.cpu

    cpu.write(0xf1, 0x79)
    cpu.Y = 0x01

    cpu.clock()

    expect(cpu.X).toBe(0x79)
  })

  it('should be able to execute correctly (absolute)', () => {
    // LDA $1000
    // operator: LDA, addressing mode: absolute
    const bus = createBus()
    bus.ram = a6502`LDA $1000`
    const cpu = bus.cpu
    cpu.write(0x1000, 0x05)

    cpu.clock()

    expect(cpu.A).toBe(0x05)
  })

  it('should be able to execute correctly (indexed absolute, register X)', () => {
    // LDA $1000,X
    // operator: LDA, addressing mode: absolute, X
    const bus = createBus()
    bus.ram = a6502`LDA $1000,X`
    const cpu = bus.cpu
    cpu.write(0x1001, 0x05)
    cpu.X = 0x01

    cpu.clock()

    expect(cpu.A).toBe(0x05)
  })

  it('should be able to execute correctly (indexed absolute, register Y)', () => {
    // LDA $1000,Y
    // operator: LDA, addressing mode: absolute, Y
    const bus = createBus()
    bus.ram = a6502`LDA $1000,Y`
    const cpu = bus.cpu
    cpu.write(0x1001, 0x05)
    cpu.Y = 0x01

    cpu.clock()

    expect(cpu.A).toBe(0x05)
  })

  it('should be able to execute correctly (immediate)', () => {
    // LDA #$FF
    // operator: LDA, addressing mode: immediate
    const bus = createBus()
    bus.ram = a6502`LDA #$FF`
    const cpu = bus.cpu

    cpu.clock()

    expect(cpu.A).toBe(0xff)
  })

  it('should be able to execute correctly (indexed indirect)', () => {
    // LDA ($B0,X)
    // operator: LDA, addressing mode: indexed indirect (IZX)
    const bus = createBus()
    bus.ram = a6502`LDA ($B0,X)`
    const cpu = bus.cpu

    cpu.write(0xb2, 0x00)
    cpu.write(0xb3, 0x10)

    cpu.write(0x1000, 0x05)
    cpu.X = 0x02

    cpu.clock()

    expect(cpu.A).toBe(0x05)
  })

  it('should be able to execute correctly (indirect indexed)', () => {
    // LDA ($B1),Y
    // operator: LDA, addressing mode: indirect indexed (IZY)
    const bus = createBus()
    bus.ram = a6502`LDA ($B1),Y`
    const cpu = bus.cpu

    cpu.write(0xb1, 0x00)
    cpu.write(0xb2, 0x10)

    cpu.write(0x100f, 0x05)
    cpu.Y = 0x0f

    cpu.clock()

    expect(cpu.A).toBe(0x5)
  })

  it('should be able to execute correctly (indirect)', () => {
    // JMP ($1234)
    // operator: JMP, addressing mode: indirect
    const bus = createBus()
    bus.ram = a6502`JMP ($1234)`
    const cpu = bus.cpu

    cpu.write(0x1234, 0x00)
    cpu.write(0x1235, 0x10)

    cpu.clock()

    expect(cpu.PC).toBe(0x1000)
  })
})
