import * as memory from './memory'
import CPU from '../../cpu'

const generateArray = (len) => [...new Array(len)].map((_) => 0)

describe('instructions: memory-related instructions', () => {
  const testLoad = (targetRegister) => {
    const instruction = `LD${targetRegister}`
    const getTargetRegisterValue = (cpu) => cpu.registers[targetRegister]

    describe(instruction, () => {
      let cpu
      const ram = generateArray(0x200)

      beforeEach(() => {
        cpu = new CPU(ram)
      })

      it(`should load from specified memory to ${targetRegister} register`, () => {
        cpu.ram[0x100] = 0x0f
        cpu.fetch({ absoluteAddress: 0x100 })

        const cycle = memory[instruction](cpu)
        expect(getTargetRegisterValue(cpu)).toBe(0x0f)
        expect(cpu.registers.STATUS.Z).toBe(false)
        expect(cpu.registers.STATUS.N).toBe(false)
        expect(cycle).toBe(0)
      })

      it('should trigger N flag if resulting accumulator value is negative', () => {
        cpu.ram[0x100] = 0xff
        cpu.fetch({ absoluteAddress: 0x100 })

        const cycle = memory[instruction](cpu)
        expect(getTargetRegisterValue(cpu)).toBe(0xff)
        expect(cpu.registers.STATUS.N).toBe(true)
        expect(cycle).toBe(0)

        cpu.ram[0x100] = 0x01
        cpu.fetch({ absoluteAddress: 0x100 })

        memory[instruction](cpu)
        expect(getTargetRegisterValue(cpu)).toBe(0x01)
        expect(cpu.registers.STATUS.N).toBe(false)

        cpu.ram[0x100] = 0x80
        cpu.fetch({ absoluteAddress: 0x100 })

        memory[instruction](cpu)
        expect(cpu.registers.STATUS.N).toBe(true)
      })

      it('should trigger Z flag if resulting accumulator value is zero', () => {
        cpu.ram[0x100] = 0x00
        cpu.fetch({ absoluteAddress: 0x100 })

        const cycle = memory[instruction](cpu)
        expect(getTargetRegisterValue(cpu)).toBe(0x00)
        expect(cpu.registers.STATUS.Z).toBe(true)
        expect(cycle).toBe(0)
      })

      // it('should return additinal cycle if page is changed', () => {
      // })
    })
  }

  const testSave = (targetRegister) => {
    const instruction = `ST${targetRegister}`
    const setTargetRegisterValue = (cpu, value) =>
      (cpu.registers[targetRegister] = value)

    describe(instruction, () => {
      it(`should save content of ${targetRegister} register to specified memory location`, () => {
        const cpu = new CPU([0, 0, 0])
        setTargetRegisterValue(cpu, 0x12)
        cpu.fetch({ absoluteAddress: 0x01 })

        memory[instruction](cpu)

        expect(cpu.ram[0x01]).toBe(0x12)
      })
    })
  }

  testLoad('A')
  testLoad('X')
  testLoad('Y')

  testSave('A')
  testSave('X')
  testSave('Y')
})
