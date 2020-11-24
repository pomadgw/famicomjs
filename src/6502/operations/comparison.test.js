import createBus from '../createbus'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

describe('instructions: comparison', () => {
  describe('CMP', () => {
    let cpu
    beforeEach(() => {
      cpu = CPU([0, 0, 0])
    })

    it(`should set carry flag if ${'A'} register is more than or equal to compared value`, () => {
      cpu.A = 0x20
      cpu.bus.ram[1] = 0x10

      cpu.absoluteAddress = 0x0001

      cpu.CMP()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })

    it(`should set zero flag if ${'A'} register is equal to compared value`, () => {
      cpu.A = 0x20
      cpu.bus.ram[1] = 0x20

      cpu.absoluteAddress = 0x0001

      cpu.CMP()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })

    it(`should set negative flag if ${'A'} register is less than compared value`, () => {
      cpu.A = 0x20
      cpu.bus.ram[1] = 0x30

      cpu.absoluteAddress = 0x0001

      cpu.CMP()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)

      cpu.STATUS.setStatus(Flags.N, false)
      cpu.A = 0x80
      cpu.bus.ram[1] = 0x00

      cpu.absoluteAddress = 0x0001

      cpu.CMP()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })

  describe('CPX', () => {
    let cpu
    beforeEach(() => {
      cpu = CPU([0, 0, 0])
    })

    it(`should set carry flag if ${'X'} register is more than or equal to compared value`, () => {
      cpu.X = 0x20
      cpu.bus.ram[1] = 0x10

      cpu.absoluteAddress = 0x0001

      cpu.CPX()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })

    it(`should set zero flag if ${'X'} register is equal to compared value`, () => {
      cpu.X = 0x20
      cpu.bus.ram[1] = 0x20

      cpu.absoluteAddress = 0x0001

      cpu.CPX()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })

    it(`should set negative flag if ${'X'} register is less than compared value`, () => {
      cpu.X = 0x20
      cpu.bus.ram[1] = 0x30

      cpu.absoluteAddress = 0x0001

      cpu.CPX()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)

      cpu.STATUS.setStatus(Flags.N, false)
      cpu.X = 0x80
      cpu.bus.ram[1] = 0x00

      cpu.absoluteAddress = 0x0001

      cpu.CPX()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })

  describe('CPY', () => {
    let cpu
    beforeEach(() => {
      cpu = CPU([0, 0, 0])
    })

    it(`should set carry flag if ${'Y'} register is more than or equal to compared value`, () => {
      cpu.Y = 0x20
      cpu.bus.ram[1] = 0x10

      cpu.absoluteAddress = 0x0001

      cpu.CPY()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })

    it(`should set zero flag if ${'Y'} register is equal to compared value`, () => {
      cpu.Y = 0x20
      cpu.bus.ram[1] = 0x20

      cpu.absoluteAddress = 0x0001

      cpu.CPY()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
    })

    it(`should set negative flag if ${'Y'} register is less than compared value`, () => {
      cpu.Y = 0x20
      cpu.bus.ram[1] = 0x30

      cpu.absoluteAddress = 0x0001

      cpu.CPY()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)

      cpu.STATUS.setStatus(Flags.N, false)
      cpu.bus.ram[1] = 0x00
      cpu.Y = 0x80

      cpu.absoluteAddress = 0x0001

      cpu.CPY()

      expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  })
})
