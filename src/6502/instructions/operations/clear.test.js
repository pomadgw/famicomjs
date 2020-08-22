import * as clear from './clear'
import CPU from '../../cpu'

describe('instructions: clear flag operations', () => {
  describe('CLC', () => {
    it('should clear the carry flag', () => {
      const cpudummy = new CPU([0])
      cpudummy.registers.STATUS.C = true
      cpudummy.fetch()
      clear.CLC(cpudummy)
      expect(cpudummy.registers.STATUS.C).toBe(false)
    })
  })
  describe('CLD', () => {
    it('should clear the BCD flag', () => {
      const cpudummy = new CPU([0])
      cpudummy.registers.STATUS.D = true
      cpudummy.fetch()
      clear.CLD(cpudummy)
      expect(cpudummy.registers.STATUS.D).toBe(false)
    })
  })
  describe('CLI', () => {
    it('should clear the interrupt flag', () => {
      const cpudummy = new CPU([0])
      cpudummy.registers.STATUS.I = true
      cpudummy.fetch()
      clear.CLI(cpudummy)
      expect(cpudummy.registers.STATUS.I).toBe(false)
    })
  })
  describe('CLV', () => {
    it('should clear the overflow flag', () => {
      const cpudummy = new CPU([0])
      cpudummy.registers.STATUS.V = true
      cpudummy.fetch()
      clear.CLV(cpudummy)
      expect(cpudummy.registers.STATUS.V).toBe(false)
    })
  })
})
