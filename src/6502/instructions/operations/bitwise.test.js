import * as bitwise from './bitwise'
import CPU from '../../cpu'

describe('instructions: bitwise operators', () => {
  describe('ORA', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpudummy = new CPU([0, 0xf0, 0, 0])
      cpudummy.registers.A = 0x0f

      cpudummy.fetch({ absoluteAddress: 0x0001 })

      bitwise.ORA(cpudummy)
      expect(cpudummy.registers.A).toBe(0xff)

      // Resulting value: 0xff, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpudummy.registers.STATUS.Z).toBe(false)
      expect(cpudummy.registers.STATUS.N).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpudummy = new CPU([0, 0x00, 0, 0])
      cpudummy.registers.A = 0x00

      cpudummy.fetch({ absoluteAddress: 0x0001 })

      bitwise.ORA(cpudummy)
      expect(cpudummy.registers.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpudummy.registers.STATUS.Z).toBe(true)
      expect(cpudummy.registers.STATUS.N).toBe(false)
    })
  })

  describe('AND', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpudummy = new CPU([0, 0xff, 0, 0])
      cpudummy.registers.A = 0xfa

      cpudummy.fetch({ absoluteAddress: 0x0001 })

      bitwise.AND(cpudummy)
      expect(cpudummy.registers.A).toBe(0xfa)

      // Resulting value: 0xfa, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpudummy.registers.STATUS.Z).toBe(false)
      expect(cpudummy.registers.STATUS.N).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpudummy = new CPU([0, 0x00, 0, 0])
      cpudummy.registers.A = 0x01

      cpudummy.fetch({ absoluteAddress: 0x0001 })

      bitwise.AND(cpudummy)
      expect(cpudummy.registers.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpudummy.registers.STATUS.Z).toBe(true)
      expect(cpudummy.registers.STATUS.N).toBe(false)
    })
  })
})
