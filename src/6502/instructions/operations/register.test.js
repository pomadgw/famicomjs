import * as register from './register'
import CPU from '../../cpu'

describe('instructions: register transfers', () => {
  let cpu

  beforeEach(() => {
    cpu = new CPU([0])
  })

  const testFlags = (instruction, targetRegister) => {
    it(`should set Z flag if ${targetRegister} register is zero`, () => {
      cpu.registers[targetRegister] = 0
      register[instruction](cpu)
      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it(`should set N flag if ${targetRegister} register is negative`, () => {
      cpu.registers[targetRegister] = 0xff
      register[instruction](cpu)
      expect(cpu.registers.STATUS.N).toBe(true)
    })
  }

  describe('TAX', () => {
    it('should transfer value from accumulator to X register', () => {
      cpu.registers.A = 0x23
      register.TAX(cpu)

      expect(cpu.registers.X).toBe(0x23)
    })

    testFlags('TAX', 'A')
  })

  describe('TAY', () => {
    it('should transfer value from accumulator to Y register', () => {
      cpu.registers.A = 0x23
      register.TAY(cpu)

      expect(cpu.registers.Y).toBe(0x23)
    })

    testFlags('TAY', 'A')
  })

  describe('TXA', () => {
    it('should transfer value from X register to accumulator', () => {
      cpu.registers.X = 0x23
      register.TXA(cpu)

      expect(cpu.registers.A).toBe(0x23)
    })

    testFlags('TXA', 'X')
  })

  describe('TYA', () => {
    it('should transfer value Y register to accumulator', () => {
      cpu.registers.Y = 0x23
      register.TYA(cpu)

      expect(cpu.registers.A).toBe(0x23)
    })

    testFlags('TYA', 'Y')
  })
})
