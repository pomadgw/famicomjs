import createBus from '../../index'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return { bus, cpu: bus.cpu }
}

const generateArray = (len) => [...new Array(len)].map((_) => 0)

describe('6502 CPU (wasm): instructions: memory-related instructions', () => {
  const testLoad = (targetRegister) => {
    const instruction = `LD${targetRegister}`
    const getTargetRegisterValue = (cpu) => cpu[targetRegister]

    describe(instruction, () => {
      let cpu = CPU([])
      let bus
      const ram = generateArray(0x200)

      beforeEach(() => {
        ({ bus, cpu } = CPU(ram))
      })

      it(`should load from specified memory to ${targetRegister} register`, () => {
        bus.ram[0x100] = 0x0f
        cpu.absoluteAddress = 0x100

        cpu[instruction]()
        expect(getTargetRegisterValue(cpu)).toBe(0x0f)
        expect(cpu.STATUS.getStatus(Flags.Z)).toBe(false)
        expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)
        expect(cpu.clocks).toBe(0)
      })

      it('should trigger N flag if resulting accumulator value is negative', () => {
        bus.ram[0x100] = 0xff
        cpu.absoluteAddress = 0x100

        cpu[instruction]()
        expect(getTargetRegisterValue(cpu)).toBe(0xff)
        expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
        expect(cpu.clocks).toBe(0)

        bus.ram[0x100] = 0x01
        cpu.absoluteAddress = 0x100

        cpu[instruction]()
        expect(getTargetRegisterValue(cpu)).toBe(0x01)
        expect(cpu.STATUS.getStatus(Flags.N)).toBe(false)

        bus.ram[0x100] = 0x80
        cpu.absoluteAddress = 0x100

        cpu[instruction]()
        expect(cpu.STATUS.getStatus(Flags.N)).toBe(true)
      })

      it('should trigger Z flag if resulting accumulator value is zero', () => {
        bus.ram[0x100] = 0x00
        cpu.absoluteAddress = 0x100

        cpu[instruction]()
        expect(getTargetRegisterValue(cpu)).toBe(0x00)
        expect(cpu.STATUS.getStatus(Flags.Z)).toBe(true)
        expect(cpu.clocks).toBe(0)
      })
    })
  }

  const testSave = (targetRegister) => {
    const instruction = `ST${targetRegister}`
    const setTargetRegisterValue = (cpu, value) =>
      (cpu[targetRegister] = value)

    describe(instruction, () => {
      it(`should save content of ${targetRegister} register to specified memory location`, () => {
        const { bus, cpu } = CPU([0, 0, 0])
        setTargetRegisterValue(cpu, 0x12)
        cpu.absoluteAddress = 0x01

        cpu[instruction]()

        expect(bus.ram[0x01]).toBe(0x12)
        expect(cpu.clocks).toBe(0)
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
