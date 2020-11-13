import * as bitwise from './bitwise'
import CPU from '../../cpu'

describe('instructions: bitwise operators', () => {
  describe('ORA', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpu = new CPU([0, 0xf0, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0x0f

      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      bitwise.ORA(cpu)
      expect(cpu.registers.A).toBe(0xff)

      // Resulting value: 0xff, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpu.registers.STATUS.Z).toBe(false)
      expect(cpu.registers.STATUS.N).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpu = new CPU([0, 0x00, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0x00

      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      bitwise.ORA(cpu)
      expect(cpu.registers.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpu.registers.STATUS.Z).toBe(true)
      expect(cpu.registers.STATUS.N).toBe(false)
    })
  })

  describe('AND', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpu = new CPU([0, 0xff, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0xfa

      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      bitwise.AND(cpu)
      expect(cpu.registers.A).toBe(0xfa)

      // Resulting value: 0xfa, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpu.registers.STATUS.Z).toBe(false)
      expect(cpu.registers.STATUS.N).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpu = new CPU([0, 0x00, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0x01

      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      bitwise.AND(cpu)
      expect(cpu.registers.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpu.registers.STATUS.Z).toBe(true)
      expect(cpu.registers.STATUS.N).toBe(false)
    })
  })

  describe('EOR', () => {
    it('should return correct value (trigger N flag)', () => {
      const cpu = new CPU([0, 0x70, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0xfa

      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      bitwise.EOR(cpu)
      expect(cpu.registers.A).toBe(0xfa ^ 0x70)

      // Resulting value: 0xfa, expected status flag value:
      // Z: 0
      // N: 1
      expect(cpu.registers.STATUS.Z).toBe(false)
      expect(cpu.registers.STATUS.N).toBe(true)
    })

    it('should return correct value (trigger Z flag)', () => {
      const cpu = new CPU([0, 0x01, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0x01

      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      bitwise.EOR(cpu)
      expect(cpu.registers.A).toBe(0x00)

      // Resulting value: 0xff, expected status flag value:
      // Z: 1
      // N: 0
      expect(cpu.registers.STATUS.Z).toBe(true)
      expect(cpu.registers.STATUS.N).toBe(false)
    })
  })

  describe('ASL', () => {
    it('should be able to shift value of a memory at specified address', () => {
      const cpu = new CPU([0, 0x01, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      bitwise.ASL(cpu)

      expect(cpu.ram[0x01]).toBe(0x01 << 1)
    })

    it('should be able to shift value of register A in-place', () => {
      const cpu = new CPU([0, 0x00, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0x01
      cpu.fetchAddress({ value: cpu.registers.A })

      bitwise.ASL(cpu)

      expect(cpu.registers.A).toBe(0x01 << 1)
    })

    it('should toggle C flag', () => {
      const cpu = new CPU([0, 0x00, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0xff
      cpu.fetchAddress({ value: cpu.registers.A })

      bitwise.ASL(cpu)

      expect(cpu.registers.A).toBe((0xff << 1) & 0xff)
      expect(cpu.registers.STATUS.C).toBe(true)
    })

    it('should toggle Z flag', () => {
      const cpu = new CPU([0, 0x00, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0b10000000
      cpu.fetchAddress({ value: cpu.registers.A })

      bitwise.ASL(cpu)

      expect(cpu.registers.A).toBe(0)
      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it('should toggle N flag', () => {
      const cpu = new CPU([0, 0x00, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0x79
      cpu.fetchAddress({ value: cpu.registers.A })

      bitwise.ASL(cpu)

      expect(cpu.registers.A).toBe(0x79 << 1)
      expect(cpu.registers.STATUS.N).toBe(true)
    })
  })

  describe('BIT', () => {
    it('should toggle Z flags if specify value ANDed with accumulator resulting in zero', () => {
      const cpu = new CPU([0, 0x00, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0x79
      cpu.fetchAddress({ absoluteAddress: 0x01 })

      bitwise.BIT(cpu)
      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it('should copy bit 7 and 6 of specified value into N and V flags', () => {
      const cpu = new CPU([0, 0b11000000, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.A = 0b00000000
      cpu.fetchAddress({ absoluteAddress: 0x01 })

      bitwise.BIT(cpu)
      expect(cpu.registers.STATUS.N).toBe(true)
      expect(cpu.registers.STATUS.V).toBe(true)
    })
  })

  describe('LSR', () => {
    let cpu

    beforeEach(() => {
      cpu = new CPU([0, 0, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
    })

    it('should shift accumulator value to right', () => {
      cpu.registers.A = 0x1f
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.LSR(cpu)

      expect(cpu.registers.A).toBe(0x1f >> 1)
    })

    it('should shift a memory value to right given absolute address', () => {
      cpu.ram[0x0001] = 0x1f
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      bitwise.LSR(cpu)

      expect(cpu.ram[0x0001]).toBe(0x1f >> 1)
    })

    it('should put bit 0 to carry flag', () => {
      cpu.registers.A = 0x1f
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.LSR(cpu)

      expect(cpu.registers.STATUS.C).toBe(true)
    })

    it('should trigger Z flag if resulting value is zero', () => {
      cpu.registers.A = 0x01
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.LSR(cpu)

      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it('should reset N flag if resulting value is not negative (given it was previously set)', () => {
      cpu.registers.STATUS.N = true

      cpu.registers.A = 0x1f
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.LSR(cpu)

      expect(cpu.registers.STATUS.N).toBe(false)
    })
  })

  describe('ROL', () => {
    let cpu

    beforeEach(() => {
      cpu = new CPU([0, 0, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
    })

    it('should rotate accumulator value to left', () => {
      cpu.registers.A = 0b00000010
      cpu.registers.STATUS.C = true

      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.ROL(cpu)

      expect(cpu.registers.A).toBe(0b00000101)
      expect(cpu.registers.STATUS.C).toBe(false)
    })

    it('should rotate a memory value to right given absolute address', () => {
      cpu.ram[0x0001] = 0b10000010
      cpu.registers.STATUS.C = false
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      bitwise.ROL(cpu)

      expect(cpu.ram[0x0001]).toBe(0b00000100)
      expect(cpu.registers.STATUS.C).toBe(true)
    })

    it('should trigger Z flag if resulting value is zero', () => {
      cpu.registers.A = 0b10000000
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.ROL(cpu)

      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it('should set N flag if resulting value is negative', () => {
      cpu.registers.STATUS.N = false

      cpu.registers.A = 0b01100000
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.ROL(cpu)

      expect(cpu.registers.STATUS.N).toBe(true)
    })
  })

  describe('ROR', () => {
    let cpu

    beforeEach(() => {
      cpu = new CPU([0, 0, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
    })

    it('should rotate accumulator value to left', () => {
      cpu.registers.A = 0b00000010
      cpu.registers.STATUS.C = true

      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.ROR(cpu)

      expect(cpu.registers.A).toBe(0b10000001)
      expect(cpu.registers.STATUS.C).toBe(false)
    })

    it('should rotate a memory value to right given absolute address', () => {
      cpu.ram[0x0001] = 0b10000011
      cpu.registers.STATUS.C = false
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      bitwise.ROR(cpu)

      expect(cpu.ram[0x0001]).toBe(0b01000001)
      expect(cpu.registers.STATUS.C).toBe(true)
    })

    it('should trigger Z flag if resulting value is zero', () => {
      cpu.registers.A = 0b00000001
      cpu.registers.STATUS.C = false
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.ROR(cpu)

      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it('should set N flag if resulting value is negative', () => {
      cpu.registers.STATUS.N = false

      cpu.registers.STATUS.C = true
      cpu.registers.A = 0b01100000
      cpu.fetchAddress({ value: cpu.registers.A })
      bitwise.ROR(cpu)

      expect(cpu.registers.STATUS.N).toBe(true)
    })
  })
})
