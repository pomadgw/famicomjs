import * as set from './set'
import CPU from '../../cpu'

describe('instructions: clear flag operations', () => {
  describe('SEC', () => {
    it('should set the carry flag', () => {
      const cpudummy = new CPU([0])
      cpudummy.registers.STATUS.C = false
      cpudummy.fetch()
      set.SEC(cpudummy)
      expect(cpudummy.registers.STATUS.C).toBe(true)
    })
  })
  describe('SED', () => {
    it('should set the BCD flag', () => {
      const cpudummy = new CPU([0])
      cpudummy.registers.STATUS.D = false
      cpudummy.fetch()
      set.SED(cpudummy)
      expect(cpudummy.registers.STATUS.D).toBe(true)
    })
  })
  describe('SEI', () => {
    it('should set the interrupt flag', () => {
      const cpudummy = new CPU([0])
      cpudummy.registers.STATUS.I = false
      cpudummy.fetch()
      set.SEI(cpudummy)
      expect(cpudummy.registers.STATUS.I).toBe(true)
    })
  })
})
