import createNES from '../../index'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createNES()
  bus.ram = ram

  return bus.cpu
}

const generateArray = (len) => [...new Array(len)].map((_) => 0)

describe('instructions: stack operations', () => {
  describe('PHA', () => {
    it('should put accumulator value to correct location', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.A = 0xff
      cpu.fetch()
      const oldStackPointer = cpu.SP

      cpu.PHA()
      expect(cpu.SP).toBe(oldStackPointer - 1)
      expect(cpu.bus.ram[oldStackPointer + 0x100]).toBe(0xff)
    })
  })

  describe('PLA', () => {
    it('should put accumulator value to correct location', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()
      const oldStackPointer = 0xfe
      cpu.bus.ram[oldStackPointer + 0x100 + 1] = 0xff
      cpu.SP = oldStackPointer

      cpu.PLA()
      expect(cpu.SP).toBe(oldStackPointer + 1)
      expect(cpu.A).toBe(0xff)
    })

    it('should set N flag correct', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()
      const oldStackPointer = 0xfd
      cpu.bus.ram[oldStackPointer + 0x100 + 1] = 0xff
      cpu.SP = oldStackPointer

      cpu.PLA()
      expect(cpu.A).toBe(0xff)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)

      cpu.PLA()
      expect(cpu.A).toBe(0x00)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })

    it('should set Z flag correct', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()
      const oldStackPointer = 0xfc
      cpu.bus.ram[oldStackPointer + 0x100 + 1] = 0x00
      cpu.bus.ram[oldStackPointer + 0x100 + 2] = 0x01
      cpu.SP = oldStackPointer

      cpu.PLA()
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)

      cpu.PLA()
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
    })
  })

  describe('PHP', () => {
    it('should push status register value into stack and set correct flags appropriately', () => {
      const cpu = CPU(generateArray(0x200))
      const status = 0b11000001
      cpu.STATUS.status = status
      cpu.fetch()
      const oldStackPointer = cpu.SP

      cpu.PHP()
      expect(cpu.SP).toBe(oldStackPointer - 1)
      expect(cpu.bus.ram[oldStackPointer + 0x100]).toBe(status | 0b00110000)
      expect(cpu.STATUS.getStatus(Flags.U)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.B)).toBe(false)
    })
  })

  describe('PLP', () => {
    it('should pop into status register and set correct flags appropriately', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()

      const status = 0b11110001
      const oldStackPointer = 0xfe
      cpu.bus.ram[oldStackPointer + 0x100 + 1] = status
      cpu.SP = oldStackPointer

      cpu.PLP()
      expect(cpu.SP).toBe(oldStackPointer + 1)
      expect(+cpu.STATUS).toBe(status)
      expect(cpu.STATUS.getStatus(Flags.U)).toBe(true)
    })
  })

  describe('TSX', () => {
    it('should transfer stack pointer register to register X', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()

      cpu.SP = 0xff
      cpu.TSX()
      expect(cpu.X).toBe(0xff)
    })

    it('should toggle N flag correctly', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()

      cpu.SP = 0xff
      cpu.TSX()
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })

    it('should toggle Z flag correctly', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()

      cpu.SP = 0x00
      cpu.TSX()
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })
  })

  describe('TXS', () => {
    it('should transfer register X to stack pointer register', () => {
      const cpu = CPU(generateArray(0x200))
      cpu.fetch()

      cpu.X = 0xe0
      cpu.TXS()
      expect(cpu.SP).toBe(0xe0)
    })
  })
})
