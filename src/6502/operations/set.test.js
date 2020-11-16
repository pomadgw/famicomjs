import createBus from '../createbus'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

describe('6502 CPU (wasm): instructions: st flag operations', () => {
  describe('SEC', () => {
    it('should clear the carry flag', () => {
      const cpudummy = CPU([0])
      cpudummy.STATUS.setStatus(Flags.C, false)
      cpudummy.fetch()
      cpudummy.SEC()
      expect(cpudummy.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpudummy.clocks).toBe(0)
    })
  })

  describe('SED', () => {
    it('should clear the BCD flag', () => {
      const cpudummy = CPU([0])
      cpudummy.STATUS.setStatus(Flags.D, false)
      cpudummy.fetch()
      cpudummy.SED()
      expect(cpudummy.STATUS.getStatus(Flags.D)).toBe(true)
      expect(cpudummy.clocks).toBe(0)
    })
  })

  describe('SEI', () => {
    it('should clear the interrupt flag', () => {
      const cpudummy = CPU([0])
      cpudummy.STATUS.setStatus(Flags.I, false)
      cpudummy.fetch()
      cpudummy.SEI()
      expect(cpudummy.STATUS.getStatus(Flags.I)).toBe(true)
      expect(cpudummy.clocks).toBe(0)
    })
  })
})
