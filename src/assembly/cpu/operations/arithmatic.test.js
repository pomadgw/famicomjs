import createNES from '../../index'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createNES()
  bus.ram = ram

  return bus.cpu
}

describe('instructions: arithmatic operators', () => {
  describe('ADC', () => {
    let cpu
    let ram

    beforeEach(() => {
      ram = [0, 0, 0, 0]
      cpu = CPU(ram)

      cpu.A = 0x10
    })

    it('should be able to add to accumulator', () => {
      ram[1] = 0x10
      cpu.absoluteAddress = 0x0001
      cpu.STATUS.setStatus(Flags.C, false)

      cpu.ADC()

      expect(cpu.A).toBe(0x20)
    })

    it('should be able to add to accumulator with carry', () => {
      ram[1] = 0x10
      cpu.STATUS.setStatus(Flags.C, true)
      cpu.absoluteAddress = 0x0001

      cpu.ADC()

      expect(cpu.A).toBe(0x21)
    })

    it('should be able to set carry flag if it is overflow', () => {
      ram[1] = 0xff
      cpu.absoluteAddress = 0x0001
      cpu.STATUS.setStatus(Flags.C, false)

      cpu.ADC()

      expect(cpu.A).toBe(0x0f)
      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
    })

    it('should be able to set negative flag if high bit is 1', () => {
      ram[1] = 0x71
      cpu.absoluteAddress = 0x0001
      cpu.STATUS.setStatus(Flags.C, false)

      cpu.ADC()

      expect(cpu.A).toBe(0x81)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })

    it('should be able to set zero flag if result is zero', () => {
      ram[1] = 0xf0
      cpu.absoluteAddress = 0x0001

      cpu.ADC()

      expect(cpu.A).toBe(0x00)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    describe('trigger overflow flag', () => {
      it('should be able to set overflow if pos + pos is neg', () => {
        ram[1] = 0x70
        cpu.absoluteAddress = 0x0001

        cpu.ADC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(true)
      })

      it('should be able to set overflow if neg + neg is pos', () => {
        cpu.A = 0xd0
        ram[1] = 0x90
        cpu.absoluteAddress = 0x0001

        cpu.ADC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(true)
      })

      it('should not set overflow if pos + pos is pos', () => {
        ram[1] = 0x10
        cpu.absoluteAddress = 0x0001

        cpu.ADC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(false)
      })

      it('should not set overflow if neg + neg is neg', () => {
        cpu.A = 0xd0
        ram[1] = 0xd0
        cpu.absoluteAddress = 0x0001

        cpu.ADC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(false)
      })
    })
  })

  describe('SBC', () => {
    let cpu
    let ram

    beforeEach(() => {
      ram = [0, 0, 0, 0]
      cpu = CPU(ram)

      cpu.A = 0x10
    })

    it('should be able to add to accumulator', () => {
      ram[1] = 0x10
      cpu.absoluteAddress = 0x0001
      cpu.STATUS.setStatus(Flags.C, true)

      cpu.SBC()

      expect(cpu.A).toBe(0)
    })

    it('should be able to add to accumulator with carry flag off', () => {
      cpu.A = 0x10
      ram[1] = 0x10
      cpu.STATUS.setStatus(Flags.C, false)
      cpu.absoluteAddress = 0x0001

      cpu.SBC()

      expect(cpu.A).toBe(0xff)
    })

    it('should be able to set carry flag', () => {
      cpu.A = 0x07
      ram[1] = -2
      cpu.absoluteAddress = 0x0001
      cpu.STATUS.setStatus(Flags.C, true)

      cpu.SBC()

      expect(cpu.A).toBe(0x09)
      expect(cpu.STATUS.getStatus(Flags.C)).toBe(false)
    })

    it('should be able to set negative flag if high bit is 1', () => {
      cpu.A = 0x07
      ram[1] = 0x09
      cpu.absoluteAddress = 0x0001
      cpu.STATUS.setStatus(Flags.C, true)

      cpu.SBC()

      expect(cpu.A).toBe(0xfe)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })

    it('should be able to set zero flag if result is zero', () => {
      cpu.A = 0x01
      ram[1] = 0x01
      cpu.absoluteAddress = 0x0001
      cpu.STATUS.setStatus(Flags.C, true)

      cpu.SBC()

      expect(cpu.A).toBe(0x00)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    describe('trigger overflow flag', () => {
      it('should be able to set overflow 1', () => {
        cpu.A = 0x81
        ram[1] = 0x07
        cpu.absoluteAddress = 0x0001

        cpu.SBC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(true)
      })

      it('should be able to set overflow 2', () => {
        cpu.A = 0x10
        ram[1] = 0x80
        cpu.absoluteAddress = 0x0001

        cpu.SBC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(true)
      })

      it('should not set overflow 1', () => {
        cpu.A = 0x07
        ram[1] = 0x02
        cpu.absoluteAddress = 0x0001

        cpu.SBC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(false)
      })

      it('should not set overflow 2', () => {
        cpu.A = 0x10
        ram[1] = 0x91
        cpu.absoluteAddress = 0x0001

        cpu.SBC()

        expect(cpu.STATUS.getStatus(Flags.V)).toBe(false)
      })
    })
  })

  const testDecrease = (targetRegister) => {
    const instruction = `DE${targetRegister}`

    describe(instruction, () => {
      let cpu
      beforeEach(() => {
        cpu = CPU([0, 0, 0])
      })

      it(`should decrease value of ${targetRegister} register by one`, () => {
        cpu[targetRegister] = 0x11

        cpu[instruction]()

        expect(cpu[targetRegister]).toBe(0x10)
      })

      it(`should set zero flag if resulting value is zero`, () => {
        cpu[targetRegister] = 0x01

        cpu[instruction]()

        expect(cpu[targetRegister]).toBe(0x00)
        expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
      })

      it(`should set negative flag if resulting value is negative`, () => {
        cpu[targetRegister] = 0x00

        cpu[instruction]()

        expect(cpu[targetRegister]).toBe(0xff)
        expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
      })
    })
  }

  describe('DEC', () => {
    let cpu
    let ram
    beforeEach(() => {
      ram = [0, 0x01, 0]
      cpu = CPU(ram)
    })

    it(`should decrease value of a memory by one`, () => {
      cpu.absoluteAddress = 0x0001

      cpu.DEC()

      expect(ram[0x0001]).toBe(0x00)
    })

    it(`should set zero flag if resulting value is zero`, () => {
      ram[0x0001] = 0x01
      cpu.absoluteAddress = 0x0001

      cpu.DEC()

      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it(`should set negative flag if resulting value is negative`, () => {
      ram[0x0001] = 0x00
      cpu.absoluteAddress = 0x0001

      cpu.DEC()

      expect(ram[0x0001]).toBe(0xff)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })

  testDecrease('X')
  testDecrease('Y')

  const testIncrease = (targetRegister) => {
    const instruction = `IN${targetRegister}`

    describe(instruction, () => {
      let cpu
      beforeEach(() => {
        cpu = CPU([0, 0, 0])
      })

      it(`should decrease value of ${targetRegister} register by one`, () => {
        cpu[targetRegister] = 0x11

        cpu[instruction]()

        expect(cpu[targetRegister]).toBe(0x12)
      })

      it(`should set zero flag if resulting value is zero`, () => {
        cpu[targetRegister] = 0xff

        cpu[instruction]()

        expect(cpu[targetRegister]).toBe(0x00)
        expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
      })

      it(`should set negative flag if resulting value is negative`, () => {
        cpu[targetRegister] = 0x80

        cpu[instruction]()

        expect(cpu[targetRegister]).toBe(0x81)
        expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
      })
    })
  }

  describe('INC', () => {
    let cpu
    let ram

    beforeEach(() => {
      ram = [0, 0x01, 0]
      cpu = CPU(ram)
    })

    it(`should decrease value of a memory by one`, () => {
      cpu.absoluteAddress = 0x0001

      cpu.INC()

      expect(ram[0x0001]).toBe(0x02)
    })

    it(`should set zero flag if resulting value is zero`, () => {
      ram[0x0001] = 0xff
      cpu.absoluteAddress = 0x0001

      cpu.INC()

      expect(ram[0x0001]).toBe(0x00)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it(`should set negative flag if resulting value is negative`, () => {
      ram[0x0001] = 0x80
      cpu.absoluteAddress = 0x0001

      cpu.INC()

      expect(ram[0x0001]).toBe(0x81)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })

  testIncrease('X')
  testIncrease('Y')
})
