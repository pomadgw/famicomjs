import * as arithmatic from './arithmatic'
import CPU from '../../cpu'

describe('instructions: bitwise operators', () => {
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
        console.log(cpudummy.registers.A)

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
})
