import createBus from '../../index'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

describe('instructions: bitwise operators', () => {
  describe('ORA', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpudummy = CPU([0, 0xf0, 0, 0])
      cpudummy.A = 0x0f

      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.ORA()
      expect(cpudummy.A).toBe(0xff)

      // Resulting value: 0xff, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpudummy = CPU([0, 0x00, 0, 0])
      cpudummy.A = 0x00

      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.ORA()
      expect(cpudummy.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(true)
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(false)
    })
  })

  describe('AND', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpudummy = CPU([0, 0xff, 0, 0])
      cpudummy.A = 0xfa

      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.AND()
      expect(cpudummy.A).toBe(0xfa)

      // Resulting value: 0xfa, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpudummy = CPU([0, 0x00, 0, 0])
      cpudummy.A = 0x01

      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.AND()
      expect(cpudummy.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(true)
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(false)
    })
  })

  describe('EOR', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpudummy = CPU([0, 0x70, 0, 0])
      cpudummy.A = 0xfa

      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.EOR()
      expect(cpudummy.A).toBe(0xfa ^ 0x70)

      // Resulting value: 0xfa, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpudummy = CPU([0, 0x01, 0, 0])
      cpudummy.A = 0x01

      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.EOR()
      expect(cpudummy.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(true)
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(false)
    })
  })

  describe('ASL', () => {
    it('should be able to shift value of a memory at specified address', () => {
      const cpudummy = CPU([0, 0x01, 0, 0])
      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.ASL()

      expect(cpudummy.bus.ram[0x01]).toBe(0x01 << 1)
    })

    it('should be able to shift value of register A in-place', () => {
      const cpudummy = CPU([0, 0x00, 0, 0])
      cpudummy.A = 0x01
      cpudummy.isImplicitInvoked = true
      cpudummy.fetchedData = cpudummy.A

      cpudummy.ASL()

      expect(cpudummy.A).toBe(0x01 << 1)
    })

    it('should toggle C flag', () => {
      const cpudummy = CPU([0, 0x00, 0, 0])
      cpudummy.A = 0xff
      cpudummy.isImplicitInvoked = true
      cpudummy.fetchedData = cpudummy.A

      cpudummy.ASL()

      expect(cpudummy.A).toBe((0xff << 1) & 0xff)
      expect(cpudummy.STATUS.getStatus(Flags.C)).toBe(true)
    })

    it('should toggle Z flag', () => {
      const cpudummy = CPU([0, 0x00, 0, 0])
      cpudummy.A = 0b10000000
      cpudummy.isImplicitInvoked = true
      cpudummy.fetchedData = cpudummy.A

      cpudummy.ASL()

      expect(cpudummy.A).toBe(0)
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it('should toggle N flag', () => {
      const cpudummy = CPU([0, 0x00, 0, 0])
      cpudummy.A = 0x79
      cpudummy.isImplicitInvoked = true
      cpudummy.fetchedData = cpudummy.A

      cpudummy.ASL()

      expect(cpudummy.A).toBe(0x79 << 1)
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })

  describe('BIT', () => {
    it('should toggle Z flags if specify value ANDed with accumulator resulting in zero', () => {
      const cpudummy = CPU([0, 0x00, 0, 0])
      cpudummy.A = 0x79
      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.BIT()
      expect(cpudummy.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it('should copy bit 7 and 6 of specified value into N and V flags', () => {
      const cpudummy = CPU([0, 0b11000000, 0, 0])
      cpudummy.A = 0b00000000
      cpudummy.absoluteAddress = 0x0001
      cpudummy.fetch()

      cpudummy.BIT()
      expect(cpudummy.STATUS.getStatus(Flags.N)).toBe(true)
      expect(cpudummy.STATUS.getStatus(Flags.V)).toBe(true)
    })
  })

  describe('LSR', () => {
    let cpu

    beforeEach(() => {
      cpu = CPU([0, 0, 0, 0])
    })

    it('should shift accumulator value to right', () => {
      cpu.A = 0x1f
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.LSR()

      expect(cpu.A).toBe(0x1f >> 1)
    })

    it('should shift a memory value to right given absolute address', () => {
      cpu.bus.ram[0x0001] = 0x1f
      cpu.absoluteAddress = 0x0001
      cpu.LSR()

      expect(cpu.bus.ram[0x0001]).toBe(0x1f >> 1)
    })

    it('should put bit 0 to carry flag', () => {
      cpu.A = 0x1f
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.LSR()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
    })

    it('should trigger Z flag if resulting value is zero', () => {
      cpu.A = 0x01
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.LSR()

      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it('should reset N flag if resulting value is not negative (given it was previously set)', () => {
      cpu.STATUS.setStatus(Flags.N, true)

      cpu.A = 0x1f
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.LSR()

      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })
  })

  describe('ROL', () => {
    let cpu

    beforeEach(() => {
      cpu = CPU([0, 0, 0, 0])
    })

    it('should rotate accumulator value to left', () => {
      cpu.A = 0b00000010
      cpu.STATUS.setStatus(Flags.C, true)

      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.ROL()

      expect(cpu.A).toBe(0b00000101)
      expect(cpu.STATUS.getStatus(Flags.C)).toBe(false)
    })

    it('should rotate a memory value to right given absolute address', () => {
      cpu.bus.ram[0x0001] = 0b10000010
      cpu.STATUS.setStatus(Flags.C, false)
      cpu.absoluteAddress = 0x0001
      cpu.ROL()

      expect(cpu.bus.ram[0x0001]).toBe(0b00000100)
      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
    })

    it('should trigger Z flag if resulting value is zero', () => {
      cpu.A = 0b10000000
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.ROL()

      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it('should set N flag if resulting value is negative', () => {
      cpu.STATUS.setStatus(Flags.N, false)

      cpu.A = 0b01100000
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.ROL()

      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })

  describe('ROR', () => {
    let cpu

    beforeEach(() => {
      cpu = CPU([0, 0, 0, 0])
    })

    it('should rotate accumulator value to left', () => {
      cpu.A = 0b00000010
      cpu.STATUS.setStatus(Flags.C, true)

      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.ROR()

      expect(cpu.A).toBe(0b10000001)
      expect(cpu.STATUS.getStatus(Flags.C)).toBe(false)
    })

    it('should rotate a memory value to right given absolute address', () => {
      cpu.bus.ram[0x0001] = 0b10000011
      cpu.STATUS.setStatus(Flags.C, false)
      cpu.absoluteAddress = 0x0001
      cpu.ROR()

      expect(cpu.bus.ram[0x0001]).toBe(0b01000001)
      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
    })

    it('should trigger Z flag if resulting value is zero', () => {
      cpu.A = 0b00000001
      cpu.STATUS.setStatus(Flags.C, false)
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.ROR()

      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it('should set N flag if resulting value is negative', () => {
      cpu.STATUS.setStatus(Flags.N, false)

      cpu.STATUS.setStatus(Flags.C, true)
      cpu.A = 0b01100000
      cpu.fetchedData = cpu.A
      cpu.isImplicitInvoked = true
      cpu.ROR()

      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })
})
