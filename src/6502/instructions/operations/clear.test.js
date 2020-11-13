import * as clear from './clear'
import CPU from '../../cpu'

describe('instructions: clear flag operations', () => {
  describe('CLC', () => {
    it('should clear the carry flag', () => {
      const cpu = new CPU([0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.STATUS.C = true
      cpu.fetch()
      clear.CLC(cpu)
      expect(cpu.registers.STATUS.C).toBe(false)
    })
  })
  describe('CLD', () => {
    it('should clear the BCD flag', () => {
      const cpu = new CPU([0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.STATUS.D = true
      cpu.fetch()
      clear.CLD(cpu)
      expect(cpu.registers.STATUS.D).toBe(false)
    })
  })
  describe('CLI', () => {
    it('should clear the interrupt flag', () => {
      const cpu = new CPU([0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.STATUS.I = true
      cpu.fetch()
      clear.CLI(cpu)
      expect(cpu.registers.STATUS.I).toBe(false)
    })
  })
  describe('CLV', () => {
    it('should clear the overflow flag', () => {
      const cpu = new CPU([0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.STATUS.V = true
      cpu.fetch()
      clear.CLV(cpu)
      expect(cpu.registers.STATUS.V).toBe(false)
    })
  })
})
