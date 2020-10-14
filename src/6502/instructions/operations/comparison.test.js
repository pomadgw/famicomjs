import * as comparison from './comparison'
import CPU from '../../cpu'

describe('instructions: comparison', () => {
  const testComparison = (targetRegister) => {
    const instruction = targetRegister === 'A' ? 'CMP' : `CP${targetRegister}`

    describe(instruction, () => {
      let cpu
      beforeEach(() => {
        cpu = new CPU([0, 0, 0])
      })

      it(`should set carry flag if ${targetRegister} register is more than or equal to compared value`, () => {
        cpu.ram[1] = 0x10
        cpu.registers[targetRegister] = 0x20

        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        comparison[instruction](cpu)

        expect(cpu.registers.STATUS.C).toBe(true)
      })

      it(`should set zero flag if ${targetRegister} register is equal to compared value`, () => {
        cpu.ram[1] = 0x20
        cpu.registers[targetRegister] = 0x20

        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        comparison[instruction](cpu)

        expect(cpu.registers.STATUS.Z).toBe(true)
      })

      it(`should set negative flag if ${targetRegister} register is less than compared value`, () => {
        cpu.ram[1] = 0x30
        cpu.registers[targetRegister] = 0x20

        cpu.fetchAddress({ absoluteAddress: 0x0001 })

        comparison[instruction](cpu)

        expect(cpu.registers.STATUS.N).toBe(true)
      })
    })
  }

  testComparison('A')
  testComparison('X')
  testComparison('Y')
})
