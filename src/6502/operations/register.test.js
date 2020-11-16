import createBus from '../createbus'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

describe('instructions: register transfers', () => {
  let cpu

  beforeEach(() => {
    cpu = CPU([0])
  })

  const testFlags = (instruction, targetRegister) => {
    it(`should set Z flag if ${targetRegister} register is zero`, () => {
      cpu[targetRegister] = 0
      cpu[instruction]()
      expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
    })

    it(`should set N flag if ${targetRegister} register is negative`, () => {
      cpu[targetRegister] = 0xff
      cpu[instruction]()
      expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
    })
  }

  describe('TAX', () => {
    it('should transfer value from accumulator to X register', () => {
      cpu.A = 0x23
      cpu.TAX()

      expect(cpu.X).toBe(0x23)
    })

    testFlags('TAX', 'A')
  })

  describe('TAY', () => {
    it('should transfer value from accumulator to Y register', () => {
      cpu.A = 0x23
      cpu.TAY()

      expect(cpu.Y).toBe(0x23)
    })

    testFlags('TAY', 'A')
  })

  describe('TXA', () => {
    it('should transfer value from X register to accumulator', () => {
      cpu.X = 0x23
      cpu.TXA()

      expect(cpu.A).toBe(0x23)
    })

    testFlags('TXA', 'X')
  })

  describe('TYA', () => {
    it('should transfer value Y register to accumulator', () => {
      cpu.Y = 0x23
      cpu.TYA()

      expect(cpu.A).toBe(0x23)
    })

    testFlags('TYA', 'Y')
  })
})
