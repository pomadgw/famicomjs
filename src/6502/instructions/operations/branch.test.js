import * as branch from './branch'
import CPU from '../../cpu'

describe('instructions: branch instructions', () => {
  describe('BCC', () => {
    it('should change PC if carry flags is off', () => {
      const cpudummy = new CPU([0x02, 0, 0, 0])
      cpudummy.registers.PC = 0
      cpudummy.registers.STATUS.C = false
      cpudummy.fetch({ relativeAddress: 2 })
      branch.BCC(cpudummy)

      expect(cpudummy.registers.PC).toBe(0x02)
      expect(cpudummy.cycles).toBe(1)
    })

    it('should not change PC if carry flags is on', () => {
      const cpudummy = new CPU([0x02, 0, 0, 0])
      cpudummy.registers.PC = 0
      cpudummy.registers.STATUS.C = true
      cpudummy.fetch({ relativeAddress: 2 })
      branch.BCC(cpudummy)

      expect(cpudummy.registers.PC).toBe(0x00)
    })

    it('should add additional clock cycle if page is changed', () => {
      const cpudummy = new CPU([0x02, 0, 0, 0])
      cpudummy.registers.PC = 0x10ff
      cpudummy.registers.STATUS.C = false
      cpudummy.fetch({ relativeAddress: 1 })
      branch.BCC(cpudummy)

      expect(cpudummy.registers.PC).toBe(0x1100)
      expect(cpudummy.cycles).toBe(2)
    })
  })
})
