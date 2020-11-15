import createBus from '../createbus'
import { Flags } from '../flags'

const generateArray = (len) => [...new Array(len)].map((_) => 0)

const definitions = [
  {
    instruction: 'BCC',
    flagToTest: 'C',
    jumpIfFlagIs: false
  },
  {
    instruction: 'BCS',
    flagToTest: 'C',
    jumpIfFlagIs: true
  },
  {
    instruction: 'BEQ',
    flagToTest: 'Z',
    jumpIfFlagIs: true
  },
  {
    instruction: 'BNE',
    flagToTest: 'Z',
    jumpIfFlagIs: false
  },
  {
    instruction: 'BMI',
    flagToTest: 'N',
    jumpIfFlagIs: true
  },
  {
    instruction: 'BPL',
    flagToTest: 'N',
    jumpIfFlagIs: false
  },
  {
    instruction: 'BVS',
    flagToTest: 'V',
    jumpIfFlagIs: true
  },
  {
    instruction: 'BVC',
    flagToTest: 'V',
    jumpIfFlagIs: false
  }
]

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

describe('instructions: branch instructions', () => {
  describe('JMP', () => {
    it('should change PC register to specified value', () => {
      const cpudummy = CPU([0x02, 0, 0, 0])
      cpudummy.PC = 0
      cpudummy.absoluteAddress = 0x0100
      cpudummy.JMP()
      expect(cpudummy.PC).toBe(0x0100)
    })
  })

  describe('JSR', () => {
    it('should change PC register to specified value', () => {
      const cpudummy = CPU(generateArray(0x1000))
      cpudummy.PC = 0
      cpudummy.absoluteAddress = 0x0100
      cpudummy.JSR()
      expect(cpudummy.PC).toBe(0x0100)
    })

    it('should save previous PC to stack correctly', () => {
      const cpudummy = CPU(generateArray(0x1000))
      cpudummy.PC = 0x1234

      cpudummy.absoluteAddress = 0x0100
      cpudummy.SP = 0xff
      cpudummy.JSR()

      expect(cpudummy.bus.ram[0x01ff]).toBe(0x12)
      expect(cpudummy.bus.ram[0x01fe]).toBe(0x33)
    })
  })

  describe('RTS', () => {
    it('should restore saved PC in stack back to PC register correctly', () => {
      const cpudummy = CPU(generateArray(0x1000))
      cpudummy.PC = 0x1000

      cpudummy.bus.ram[0x1ff] = 0x12
      cpudummy.bus.ram[0x1fe] = 0x33
      cpudummy.SP = 0xfd
      // cpudummy.fetchAddress()
      cpudummy.RTS()

      expect(cpudummy.PC).toBe(0x1234)
    })
  })

  definitions.forEach(({ instruction, flagToTest, jumpIfFlagIs }) => {
    describe(instruction, () => {
      it(`should change PC if ${flagToTest} flags is ${
        jumpIfFlagIs ? 'on' : 'off'
      }`, () => {
        const cpudummy = CPU([0x02, 0, 0, 0])
        cpudummy.PC = 0
        cpudummy.STATUS.setStatus(Flags[flagToTest], jumpIfFlagIs)
        cpudummy.relativeAddress = 2
        cpudummy[instruction]()

        expect(cpudummy.PC).toBe(0x02)
        expect(cpudummy.clocks).toBe(1)
      })

      it(`should change not PC if ${flagToTest} flags is ${
        jumpIfFlagIs ? 'off' : 'on'
      }`, () => {
        const cpudummy = CPU([0x02, 0, 0, 0])
        cpudummy.PC = 0
        cpudummy.STATUS.setStatus(Flags[flagToTest], !jumpIfFlagIs)
        cpudummy.relativeAddress = 2
        cpudummy[instruction]()

        expect(cpudummy.PC).toBe(0x00)
      })

      it('should add additional clock cycle if page is changed', () => {
        const cpudummy = CPU([0x02, 0, 0, 0])
        cpudummy.PC = 0x10ff
        cpudummy.STATUS.setStatus(Flags[flagToTest], jumpIfFlagIs)
        cpudummy.relativeAddress = 1
        cpudummy[instruction]()

        expect(cpudummy.PC).toBe(0x1100)
        expect(cpudummy.clocks).toBe(2)
      })
    })
  })
})
