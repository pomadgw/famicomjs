import createBus from '../createbus'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

describe('instructions: comparison', () => {
  const testComparison = (targetRegister) => {
    const instruction = targetRegister === 'A' ? 'CMP' : `CP${targetRegister}`

    describe(instruction, () => {
      let cpu
      beforeEach(() => {
        cpu = CPU([0, 0, 0])
      })

      it(`should set carry flag if ${targetRegister} register is more than or equal to compared value`, () => {
        cpu.bus.ram[1] = 0x10
        cpu[targetRegister] = 0x20

        cpu.absoluteAddress = 0x0001

        cpu[instruction]()

        expect(cpu.STATUS.getStatus(Flags.C)).toBe(true)
      })

      it(`should set zero flag if ${targetRegister} register is equal to compared value`, () => {
        cpu.bus.ram[1] = 0x20
        cpu[targetRegister] = 0x20

        cpu.absoluteAddress = 0x0001

        cpu[instruction]()

        expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
      })

      it(`should set negative flag if ${targetRegister} register is less than compared value`, () => {
        cpu.bus.ram[1] = 0x30
        cpu[targetRegister] = 0x20

        cpu.absoluteAddress = 0x0001

        cpu[instruction]()

        expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)

        cpu.STATUS.setStatus(Flags.N, false)
        cpu.bus.ram[1] = 0x00
        cpu[targetRegister] = 0x80

        cpu.absoluteAddress = 0x0001

        cpu[instruction]()

        expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
      })
    })
  }

  testComparison('A')
  testComparison('X')
  testComparison('Y')
})
