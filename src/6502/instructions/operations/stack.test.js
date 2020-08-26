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
      cpu.ram[oldStackPointer + 0x100 + 1] = 0xff
      cpu.registers.SP = oldStackPointer

      stack.PLA(cpu)
      expect(cpu.registers.SP).toBe(oldStackPointer + 1)
      expect(cpu.registers.A).toBe(0xff)
    })

    it('should set N flag correct', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()
      const oldStackPointer = 0xfd
      cpu.ram[oldStackPointer + 0x100 + 1] = 0xff
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
      const oldStackPointer = 0xfc
      cpu.ram[oldStackPointer + 0x100 + 1] = 0x00
      cpu.ram[oldStackPointer + 0x100 + 2] = 0x01
      cpu.registers.SP = oldStackPointer

      stack.PLA(cpu)
      expect(cpu.registers.STATUS.Z).toBe(true)

      stack.PLA(cpu)
      expect(cpu.registers.STATUS.Z).toBe(false)
    })
  })

  describe('PHP', () => {
    it('should push status register value into stack and set correct flags appropriately', () => {
      const cpu = new CPU(generateArray(0x200))
      const status = 0b11000001
      cpu.registers.STATUS.status = status
      cpu.fetch()
      const oldStackPointer = cpu.registers.SP

      stack.PHP(cpu)
      expect(cpu.registers.SP).toBe(oldStackPointer - 1)
      expect(cpu.ram[oldStackPointer + 0x100]).toBe(status | 0b00110000)
      expect(cpu.registers.STATUS.U).toBe(false)
      expect(cpu.registers.STATUS.B).toBe(false)
    })
  })

  describe('PLP', () => {
    it('should pop into status register and set correct flags appropriately', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()

      const status = 0b11110001
      const oldStackPointer = 0xfe
      cpu.ram[oldStackPointer + 0x100 + 1] = status
      cpu.registers.SP = oldStackPointer

      stack.PLP(cpu)
      expect(cpu.registers.SP).toBe(oldStackPointer + 1)
      expect(+cpu.registers.STATUS).toBe(status)
      expect(cpu.registers.STATUS.U).toBe(true)
    })
  })

  describe('TSX', () => {
    it('should transfer stack pointer register to register X', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()

      cpu.registers.SP = 0xff
      stack.TSX(cpu)
      expect(cpu.registers.X).toBe(0xff)
    })

    it('should toggle N flag correctly', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()

      cpu.registers.SP = 0xff
      stack.TSX(cpu)
      expect(cpu.registers.STATUS.N).toBe(true)
    })

    it('should toggle Z flag correctly', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()

      cpu.registers.SP = 0x00
      stack.TSX(cpu)
      expect(cpu.registers.STATUS.Z).toBe(true)
    })
  })

  describe('TXS', () => {
    it('should transfer register X to stack pointer register', () => {
      const cpu = new CPU(generateArray(0x200))
      cpu.fetch()

      cpu.registers.X = 0xe0
      stack.TXS(cpu)
      expect(cpu.registers.SP).toBe(0xe0)
    })
  })
})
