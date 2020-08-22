import * as stack from './stack'
import CPU from '../../cpu'

const generateArray = (len) => [...new Array(len)].map((_) => 0)

describe('instructions: stack operations', () => {
  describe('PHA', () => {
    it('should put accumulator value to correct location', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.registers.A = 0xff
      cpu.fetch()
      const oldStackPointer = cpu.registers.SP

      stack.PHA(cpu)
      expect(cpu.registers.SP).toBe(oldStackPointer - 1)
      expect(cpu.ram[oldStackPointer + 0x100]).toBe(0xff)
    })
  })

  describe('PLA', () => {
    it('should put accumulator value to correct location', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()
      const oldStackPointer = 0xfe
      cpu.ram[oldStackPointer + 0x100] = 0xff
      cpu.registers.SP = oldStackPointer

      stack.PLA(cpu)
      expect(cpu.registers.SP).toBe(oldStackPointer + 1)
      expect(cpu.registers.A).toBe(0xff)
    })

    it('should set N flag correct', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()
      const oldStackPointer = 0xfd
      cpu.ram[oldStackPointer + 0x100] = 0xff
      cpu.registers.SP = oldStackPointer

      stack.PLA(cpu)
      expect(cpu.registers.A).toBe(0xff)
      expect(cpu.registers.STATUS.N).toBe(true)

      stack.PLA(cpu)
      expect(cpu.registers.A).toBe(0x00)
      expect(cpu.registers.STATUS.N).toBe(false)
    })

    it('should set Z flag correct', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()
      const oldStackPointer = 0xfd
      cpu.ram[oldStackPointer + 0x100] = 0x00
      cpu.ram[oldStackPointer + 0x100 + 1] = 0x01
      cpu.registers.SP = oldStackPointer

      stack.PLA(cpu)
      expect(cpu.registers.STATUS.Z).toBe(true)

      stack.PLA(cpu)
      expect(cpu.registers.STATUS.Z).toBe(false)
    })
  })
})
