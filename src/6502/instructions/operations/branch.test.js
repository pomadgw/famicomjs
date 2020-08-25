import * as branch from './branch'
import CPU from '../../cpu'

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

describe('instructions: branch instructions', () => {
  describe('JMP', () => {
    it('should change PC register to specified value', () => {
      const cpudummy = new CPU([0x02, 0, 0, 0])
      cpudummy.registers.PC = 0
      cpudummy.fetch({ absoluteAddress: 0x0100 })
      branch.JMP(cpudummy)
      expect(cpudummy.registers.PC).toBe(0x0100)
    })
  })

  describe('JSR', () => {
    it('should change PC register to specified value', () => {
      const cpudummy = new CPU(generateArray(0x1000))
      cpudummy.registers.PC = 0
      cpudummy.fetch({ absoluteAddress: 0x0100 })
      branch.JSR(cpudummy)
      expect(cpudummy.registers.PC).toBe(0x0100)
    })

    it('should save previous PC to stack correctly', () => {
      const cpudummy = new CPU(generateArray(0x1000))
      cpudummy.registers.PC = 0x1234

      cpudummy.fetch({ absoluteAddress: 0x0100 })
      branch.JSR(cpudummy)

      expect(cpudummy.ram[0x1ff]).toBe(0x12)
      expect(cpudummy.ram[0x1fe]).toBe(0x33)
    })
  })

  describe('RTS', () => {
    it('should restore saved PC in stack back to PC register correctly', () => {
      const cpudummy = new CPU(generateArray(0x1000))
      cpudummy.registers.PC = 0x1000

      cpudummy.ram[0x1ff] = 0x12
      cpudummy.ram[0x1fe] = 0x33
      cpudummy.registers.SP = 0xfd
      cpudummy.fetch()
      branch.RTS(cpudummy)

      expect(cpudummy.registers.PC).toBe(0x1233)
    })
  })

  definitions.forEach(({ instruction, flagToTest, jumpIfFlagIs }) => {
    describe(instruction, () => {
      it(`should change PC if ${flagToTest} flags is ${
        jumpIfFlagIs ? 'on' : 'off'
      }`, () => {
        const cpudummy = new CPU([0x02, 0, 0, 0])
        cpudummy.registers.PC = 0
        cpudummy.registers.STATUS[flagToTest] = jumpIfFlagIs
        cpudummy.fetch({ relativeAddress: 2 })
        branch[instruction](cpudummy)

        expect(cpudummy.registers.PC).toBe(0x02)
        expect(cpudummy.cycles).toBe(1)
      })

      it(`should change not PC if ${flagToTest} flags is ${
        jumpIfFlagIs ? 'off' : 'on'
      }`, () => {
        const cpudummy = new CPU([0x02, 0, 0, 0])
        cpudummy.registers.PC = 0
        cpudummy.registers.STATUS[flagToTest] = !jumpIfFlagIs
        cpudummy.fetch({ relativeAddress: 2 })
        branch[instruction](cpudummy)

        expect(cpudummy.registers.PC).toBe(0x00)
      })

      it('should add additional clock cycle if page is changed', () => {
        const cpudummy = new CPU([0x02, 0, 0, 0])
        cpudummy.registers.PC = 0x10ff
        cpudummy.registers.STATUS[flagToTest] = jumpIfFlagIs
        cpudummy.fetch({ relativeAddress: 1 })
        branch[instruction](cpudummy)

        expect(cpudummy.registers.PC).toBe(0x1100)
        expect(cpudummy.cycles).toBe(2)
      })
    })
  })
})
