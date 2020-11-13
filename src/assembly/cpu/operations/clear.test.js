import createNES from '../../index'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createNES()
  bus.ram = ram

  return bus.cpu
}

describe('6502 CPU (wasm): instructions: clear flag operations', () => {
  describe('CLC', () => {
    it('should clear the carry flag', () => {
      const cpudummy = CPU([0])
      cpudummy.STATUS.setStatus(Flags.C, true)
      cpudummy.fetch()
      cpudummy.CLC()
      expect(cpudummy.STATUS.getStatus(Flags.C)).toBe(false)
      expect(cpudummy.clocks).toBe(0)
    })
  })
  describe('CLD', () => {
    it('should clear the BCD flag', () => {
      const cpudummy = CPU([0])
      cpudummy.STATUS.setStatus(Flags.D, true)
      cpudummy.fetch()
      cpudummy.CLD()
      expect(cpudummy.STATUS.getStatus(Flags.D)).toBe(false)
      expect(cpudummy.clocks).toBe(0)
    })
  })
  describe('CLI', () => {
    it('should clear the interrupt flag', () => {
      const cpudummy = CPU([0])
      cpudummy.STATUS.setStatus(Flags.I, true)
      cpudummy.fetch()
      cpudummy.CLI()
      expect(cpudummy.STATUS.getStatus(Flags.I)).toBe(false)
      expect(cpudummy.clocks).toBe(0)
    })
  })
  describe('CLV', () => {
    it('should clear the overflow flag', () => {
      const cpudummy = CPU([0])
      cpudummy.STATUS.setStatus(Flags.V, true)
      cpudummy.fetch()
      cpudummy.CLV()
      expect(cpudummy.STATUS.getStatus(Flags.V)).toBe(false)
      expect(cpudummy.clocks).toBe(0)
    })
  })
})
