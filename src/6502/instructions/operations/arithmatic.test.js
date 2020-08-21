import * as arithmatic from './arithmatic'
import CPU from '../../cpu'

describe('instructions: arithmatic operators', () => {
  describe('ADC', () => {
    let cpudummy
    let ram

    beforeEach(() => {
      ram = [0, 0, 0, 0]
      cpudummy = new CPU(ram)

      cpudummy.registers.A = 0x10
    })

    it('should be able to add to accumulator', () => {
      cpudummy.ram[1] = 0x10
      cpudummy.fetch({ absoluteAddress: 0x0001 })
      cpudummy.registers.STATUS.C = false

      arithmatic.ADC(cpudummy)

      expect(cpudummy.registers.A).toBe(0x20)
    })

    it('should be able to add to accumulator with carry', () => {
      cpudummy.ram[1] = 0x10
      cpudummy.registers.STATUS.C = true
      cpudummy.fetch({ absoluteAddress: 0x0001 })

      arithmatic.ADC(cpudummy)

      expect(cpudummy.registers.A).toBe(0x21)
    })

    it('should be able to set carry flag if it is overflow', () => {
      cpudummy.ram[1] = 0xff
      cpudummy.fetch({ absoluteAddress: 0x0001 })
      cpudummy.registers.STATUS.C = false

      arithmatic.ADC(cpudummy)

      expect(cpudummy.registers.A).toBe(0x0f)
      expect(cpudummy.registers.STATUS.C).toBe(true)
    })

    it('should be able to set negative flag if high bit is 1', () => {
      cpudummy.ram[1] = 0x71
      cpudummy.fetch({ absoluteAddress: 0x0001 })
      cpudummy.registers.STATUS.C = false

      arithmatic.ADC(cpudummy)

      expect(cpudummy.registers.A).toBe(0x81)
      expect(cpudummy.registers.STATUS.N).toBe(true)
    })

    it('should be able to set zero flag if result is zero', () => {
      cpudummy.ram[1] = 0xf0
      cpudummy.fetch({ absoluteAddress: 0x0001 })

      arithmatic.ADC(cpudummy)

      expect(cpudummy.registers.A).toBe(0x00)
      expect(cpudummy.registers.STATUS.Z).toBe(true)
    })

    describe('trigger overflow flag', () => {
      it('should be able to set overflow if pos + pos is neg', () => {
        cpudummy.ram[1] = 0x70
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(true)
      })

      it('should be able to set overflow if neg + neg is pos', () => {
        cpudummy.registers.A = 0xd0
        cpudummy.ram[1] = 0x90
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(true)
      })

      it('should not set overflow if pos + pos is pos', () => {
        cpudummy.ram[1] = 0x10
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(false)
      })

      it('should not set overflow if neg + neg is neg', () => {
        cpudummy.registers.A = 0xd0
        cpudummy.ram[1] = 0xd0
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.ADC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(false)
      })
    })
  })

  describe('SBC', () => {
    let cpudummy
    let ram

    beforeEach(() => {
      ram = [0, 0, 0, 0]
      cpudummy = new CPU(ram)

      cpudummy.registers.A = 0x10
    })

    it('should be able to add to accumulator', () => {
      cpudummy.ram[1] = 0x10
      cpudummy.fetch({ absoluteAddress: 0x0001 })
      cpudummy.registers.STATUS.C = true

      arithmatic.SBC(cpudummy)

      expect(cpudummy.registers.A).toBe(0)
    })

    it('should be able to add to accumulator with carry flag off', () => {
      cpudummy.registers.A = 0x10
      cpudummy.ram[1] = 0x10
      cpudummy.registers.STATUS.C = false
      cpudummy.fetch({ absoluteAddress: 0x0001 })

      arithmatic.SBC(cpudummy)

      expect(cpudummy.registers.A).toBe(0xff)
    })

    it('should be able to set carry flag', () => {
      cpudummy.registers.A = 0x07
      cpudummy.ram[1] = -2 & 0xff
      cpudummy.fetch({ absoluteAddress: 0x0001 })
      cpudummy.registers.STATUS.C = true

      arithmatic.SBC(cpudummy)

      expect(cpudummy.registers.A).toBe(0x09)
      expect(cpudummy.registers.STATUS.C).toBe(false)
    })

    it('should be able to set negative flag if high bit is 1', () => {
      cpudummy.registers.A = 0x07
      cpudummy.ram[1] = 0x09
      cpudummy.fetch({ absoluteAddress: 0x0001 })
      cpudummy.registers.STATUS.C = true

      arithmatic.SBC(cpudummy)

      expect(cpudummy.registers.A).toBe(0xfe)
      expect(cpudummy.registers.STATUS.N).toBe(true)
    })

    it('should be able to set zero flag if result is zero', () => {
      cpudummy.registers.A = 0x01
      cpudummy.ram[1] = 0x01
      cpudummy.fetch({ absoluteAddress: 0x0001 })
      cpudummy.registers.STATUS.C = true

      arithmatic.SBC(cpudummy)

      expect(cpudummy.registers.A).toBe(0x00)
      expect(cpudummy.registers.STATUS.Z).toBe(true)
    })

    describe('trigger overflow flag', () => {
      it('should be able to set overflow 1', () => {
        cpudummy.registers.A = 0x81
        cpudummy.ram[1] = 0x07
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(true)
      })

      it('should be able to set overflow 2', () => {
        cpudummy.registers.A = 0x10
        cpudummy.ram[1] = 0x80
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(true)
      })

      it('should not set overflow 1', () => {
        cpudummy.registers.A = 0x07
        cpudummy.ram[1] = 0x02
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(false)
      })

      it('should not set overflow 2', () => {
        cpudummy.registers.A = 0x10
        cpudummy.ram[1] = 0x91
        cpudummy.fetch({ absoluteAddress: 0x0001 })

        arithmatic.SBC(cpudummy)

        expect(cpudummy.registers.STATUS.V).toBe(false)
      })
    })
  })
})
