import * as set from './set'
import CPU from '../../cpu'

describe('instructions: clear flag operations', () => {
  describe('SEC', () => {
    it('should set the carry flag', () => {
      const cpu = new CPU([0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.STATUS.C = false
      cpu.fetch()
      set.SEC(cpu)
      expect(cpu.registers.STATUS.C).toBe(true)
    })
  })
  describe('SED', () => {
    it('should set the BCD flag', () => {
      const cpu = new CPU([0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.STATUS.D = false
      cpu.fetch()
      set.SED(cpu)
      expect(cpu.registers.STATUS.D).toBe(true)
    })
  })
  describe('SEI', () => {
    it('should set the interrupt flag', () => {
      const cpu = new CPU([0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.STATUS.I = false
      cpu.fetch()
      set.SEI(cpu)
      expect(cpu.registers.STATUS.I).toBe(true)
    })
  })
})
