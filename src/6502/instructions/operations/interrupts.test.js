import * as interrupts from './interrupts'
import CPU from '../../cpu'
import { FLAGS } from '../../register'

const generateArray = (len) => [...new Array(len)].map((_) => 0)

describe('instructions: interrupts', () => {
  describe('BRK', () => {
    let cpu
    const defaultPC = 0x4000
    let stackPosition

    beforeEach(() => {
      cpu = new CPU(generateArray(0x10000))
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.PC = defaultPC
      cpu.ram[0xfffe] = 0x34
      cpu.ram[0xffff] = 0x12
      stackPosition = cpu.registers.SP
      cpu.fetch()
      interrupts.BRK(cpu)
    })

    it('should toggle interrupt flag', () => {
      expect(cpu.registers.STATUS.I).toBe(true)
    })

    it('should save PC', () => {
      expect(cpu.ram[0x100 + stackPosition]).toBe(0x40)
      expect(cpu.ram[0x100 + stackPosition - 1]).toBe(0x01)
    })

    it('should save status flags', () => {
      const expectedStatus = 0 | FLAGS.I | FLAGS.B
      expect(cpu.ram[0x100 + stackPosition - 2]).toBe(expectedStatus)
    })

    it('should change PC to address as defined in 0xfffe & 0xffff', () => {
      expect(cpu.registers.PC).toBe(0x1234)
    })
  })

  describe('RTI', () => {
    it('should restore saved PC in stack back to PC register correctly', () => {
      const cpu = new CPU(generateArray(0x1000))
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.PC = 0x1000

      cpu.ram[0x1ff] = 0x12
      cpu.ram[0x1fe] = 0x33
      cpu.ram[0x1fd] = 0x33
      cpu.registers.SP = 0xfc
      cpu.fetch()
      interrupts.RTI(cpu)

      expect(cpu.registers.PC).toBe(0x1233)
    })

    it('should restore saved status in stack back to status register correctly', () => {
      const status = 0b11111111
      const cpu = new CPU(generateArray(0x1000))
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.PC = 0x1000

      cpu.ram[0x1ff] = 0x12
      cpu.ram[0x1fe] = 0x33
      cpu.ram[0x1fd] = status
      cpu.registers.SP = 0xfc
      cpu.fetch()
      interrupts.RTI(cpu)

      expect(+cpu.registers.STATUS).toBe(0b11001111)
    })
  })
})
