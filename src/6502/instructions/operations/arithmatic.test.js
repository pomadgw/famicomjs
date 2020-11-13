import * as arithmatic from './arithmatic'
import CPU from '../../cpu'

describe('instructions: arithmatic operators', () => {
  describe('ADC', () => {
    let cpu
    let ram

    beforeEach(() => {
      ram = [0, 0, 0, 0]
      cpu = new CPU(ram)
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }

      cpu.registers.A = 0x10
    })

    it('should be able to add to accumulator', () => {
      cpu.ram[1] = 0x10
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      cpu.registers.STATUS.C = false

      arithmatic.ADC(cpu)

      expect(cpu.registers.A).toBe(0x20)
    })

    it('should be able to add to accumulator with carry', () => {
      cpu.ram[1] = 0x10
      cpu.registers.STATUS.C = true
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.ADC(cpu)

      expect(cpu.registers.A).toBe(0x21)
    })

    it('should be able to set carry flag if it is overflow', () => {
      cpu.ram[1] = 0xff
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      cpu.registers.STATUS.C = false

      arithmatic.ADC(cpu)

      expect(cpu.registers.A).toBe(0x0f)
      expect(cpu.registers.STATUS.C).toBe(true)
    })

    it('should be able to set negative flag if high bit is 1', () => {
      cpu.ram[1] = 0x71
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      cpu.registers.STATUS.C = false

      arithmatic.ADC(cpu)

      expect(cpu.registers.A).toBe(0x81)
      expect(cpu.registers.STATUS.N).toBe(true)
    })

    it('should be able to set zero flag if result is zero', () => {
      cpu.ram[1] = 0xf0
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.ADC(cpu)

      expect(cpu.registers.A).toBe(0x00)
      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    describe('trigger overflow flag', () => {
      it('should be able to set overflow if pos + pos is neg', () => {
        cpu.ram[1] = 0x70
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpu)

        expect(cpu.registers.STATUS.V).toBe(true)
      })

      it('should be able to set overflow if neg + neg is pos', () => {
        cpu.registers.A = 0xd0
        cpu.ram[1] = 0x90
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpu)

        expect(cpu.registers.STATUS.V).toBe(true)
      })

      it('should not set overflow if pos + pos is pos', () => {
        cpu.ram[1] = 0x10
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpu)

        expect(cpu.registers.STATUS.V).toBe(false)
      })

      it('should not set overflow if neg + neg is neg', () => {
        cpu.registers.A = 0xd0
        cpu.ram[1] = 0xd0
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpu)

        expect(cpu.registers.STATUS.V).toBe(false)
      })
    })
  })

  describe('SBC', () => {
    let cpu
    let ram

    beforeEach(() => {
      ram = [0, 0, 0, 0]
      cpu = new CPU(ram)
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }

      cpu.registers.A = 0x10
    })

    it('should be able to add to accumulator', () => {
      cpu.ram[1] = 0x10
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      cpu.registers.STATUS.C = true

      arithmatic.SBC(cpu)

      expect(cpu.registers.A).toBe(0)
    })

    it('should be able to add to accumulator with carry flag off', () => {
      cpu.registers.A = 0x10
      cpu.ram[1] = 0x10
      cpu.registers.STATUS.C = false
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.SBC(cpu)

      expect(cpu.registers.A).toBe(0xff)
    })

    it('should be able to set carry flag', () => {
      cpu.registers.A = 0x07
      cpu.ram[1] = -2
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      cpu.registers.STATUS.C = true

      arithmatic.SBC(cpu)

      expect(cpu.registers.A).toBe(0x09)
      expect(cpu.registers.STATUS.C).toBe(false)
    })

    it('should be able to set negative flag if high bit is 1', () => {
      cpu.registers.A = 0x07
      cpu.ram[1] = 0x09
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      cpu.registers.STATUS.C = true

      arithmatic.SBC(cpu)

      expect(cpu.registers.A).toBe(0xfe)
      expect(cpu.registers.STATUS.N).toBe(true)
    })

    it('should be able to set zero flag if result is zero', () => {
      cpu.registers.A = 0x01
      cpu.ram[1] = 0x01
      cpu.fetchAddress({ absoluteAddress: 0x0001 })
      cpu.registers.STATUS.C = true

      arithmatic.SBC(cpu)

      expect(cpu.registers.A).toBe(0x00)
      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    describe('trigger overflow flag', () => {
      it('should be able to set overflow 1', () => {
        cpu.registers.A = 0x81
        cpu.ram[1] = 0x07
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpu)

        expect(cpu.registers.STATUS.V).toBe(true)
      })

      it('should be able to set overflow 2', () => {
        cpu.registers.A = 0x10
        cpu.ram[1] = 0x80
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpu)

        expect(cpu.registers.STATUS.V).toBe(true)
      })

      it('should not set overflow 1', () => {
        cpu.registers.A = 0x07
        cpu.ram[1] = 0x02
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpu)

        expect(cpu.registers.STATUS.V).toBe(false)
      })

      it('should not set overflow 2', () => {
        cpu.registers.A = 0x10
        cpu.ram[1] = 0x91
        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpu)

        expect(cpu.registers.STATUS.V).toBe(false)
      })
    })
  })

  const testDecrease = (targetRegister) => {
    const instruction = `DE${targetRegister}`

    describe(instruction, () => {
      let cpu
      beforeEach(() => {
        cpu = new CPU([0, 0, 0])
        cpu.bus = {
          cpuRead(addr) {
            return cpu.ram[addr]
          },
          cpuWrite(addr, value) {
            cpu.ram[addr] = value
          }
        }
      })

      it(`should decrease value of ${targetRegister} register by one`, () => {
        cpu.registers[targetRegister] = 0x11
        cpu.fetchAddress()

        arithmatic[instruction](cpu)

        expect(cpu.registers[targetRegister]).toBe(0x10)
      })

      it(`should set zero flag if resulting value is zero`, () => {
        cpu.registers[targetRegister] = 0x01
        cpu.fetchAddress()

        arithmatic[instruction](cpu)

        expect(cpu.registers[targetRegister]).toBe(0x00)
        expect(cpu.registers.STATUS.Z).toBe(true)
      })

      it(`should set negative flag if resulting value is negative`, () => {
        cpu.registers[targetRegister] = 0x00
        cpu.fetchAddress()

        arithmatic[instruction](cpu)

        expect(cpu.registers[targetRegister]).toBe(0xff)
        expect(cpu.registers.STATUS.N).toBe(true)
      })
    })
  }

  describe('DEC', () => {
    let cpu
    beforeEach(() => {
      cpu = new CPU([0, 0x01, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
    })

    it(`should decrease value of a memory by one`, () => {
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.DEC(cpu)

      expect(cpu.ram[0x0001]).toBe(0x00)
    })

    it(`should set zero flag if resulting value is zero`, () => {
      cpu.ram[0x0001] = 0x01
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.DEC(cpu)

      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it(`should set negative flag if resulting value is negative`, () => {
      cpu.ram[0x0001] = 0x00
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.DEC(cpu)

      expect(cpu.ram[0x0001]).toBe(0xff)
      expect(cpu.registers.STATUS.N).toBe(true)
    })
  })

  testDecrease('X')
  testDecrease('Y')

  const testIncrease = (targetRegister) => {
    const instruction = `IN${targetRegister}`

    describe(instruction, () => {
      let cpu
      beforeEach(() => {
        cpu = new CPU([0, 0, 0])
        cpu.bus = {
          cpuRead(addr) {
            return cpu.ram[addr]
          },
          cpuWrite(addr, value) {
            cpu.ram[addr] = value
          }
        }
      })

      it(`should decrease value of ${targetRegister} register by one`, () => {
        cpu.registers[targetRegister] = 0x11
        cpu.fetchAddress()

        arithmatic[instruction](cpu)

        expect(cpu.registers[targetRegister]).toBe(0x12)
      })

      it(`should set zero flag if resulting value is zero`, () => {
        cpu.registers[targetRegister] = 0xff
        cpu.fetchAddress()

        arithmatic[instruction](cpu)

        expect(cpu.registers[targetRegister]).toBe(0x00)
        expect(cpu.registers.STATUS.Z).toBe(true)
      })

      it(`should set negative flag if resulting value is negative`, () => {
        cpu.registers[targetRegister] = 0x80
        cpu.fetchAddress()

        arithmatic[instruction](cpu)

        expect(cpu.registers[targetRegister]).toBe(0x81)
        expect(cpu.registers.STATUS.N).toBe(true)
      })
    })
  }

  describe('INC', () => {
    let cpu
    beforeEach(() => {
      cpu = new CPU([0, 0x01, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
    })

    it(`should decrease value of a memory by one`, () => {
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.INC(cpu)

      expect(cpu.ram[0x0001]).toBe(0x02)
    })

    it(`should set zero flag if resulting value is zero`, () => {
      cpu.ram[0x0001] = 0xff
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.INC(cpu)

      expect(cpu.ram[0x0001]).toBe(0x00)
      expect(cpu.registers.STATUS.Z).toBe(true)
    })

    it(`should set negative flag if resulting value is negative`, () => {
      cpu.ram[0x0001] = 0x80
      cpu.fetchAddress({ absoluteAddress: 0x0001 })

      arithmatic.INC(cpu)

      expect(cpu.ram[0x0001]).toBe(0x81)
      expect(cpu.registers.STATUS.N).toBe(true)
    })
  })

  testIncrease('X')
  testIncrease('Y')
})
