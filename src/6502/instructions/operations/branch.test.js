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
      const cpu = new CPU([0x02, 0, 0, 0])
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.PC = 0
      cpu.fetchAddress({ absoluteAddress: 0x0100 })
      branch.JMP(cpu)
      expect(cpu.registers.PC).toBe(0x0100)
    })
  })

  describe('JSR', () => {
    it('should change PC register to specified value', () => {
      const cpu = new CPU(generateArray(0x1000))
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.PC = 0
      cpu.fetchAddress({ absoluteAddress: 0x0100 })
      branch.JSR(cpu)
      expect(cpu.registers.PC).toBe(0x0100)
    })

    it('should save previous PC to stack correctly', () => {
      const cpu = new CPU(generateArray(0x1000))
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.PC = 0x1234

      cpu.fetchAddress({ absoluteAddress: 0x0100 })
      branch.JSR(cpu)

      expect(cpu.ram[0x1ff]).toBe(0x12)
      expect(cpu.ram[0x1fe]).toBe(0x33)
    })
  })

  describe('RTS', () => {
    it('should restore saved PC in stack back to PC register correctly', () => {
      const cpu = new CPU(generateArray(0x1000))
      cpu.bus = {
        cpuRead(addr) {
          return cpu.ram[addr]
        },
        cpuWrite(addr, value) {
          cpu.ram[addr] = value
        }
      }
      cpu.registers.PC = 0x1000

      cpu.ram[0x1ff] = 0x12
      cpu.ram[0x1fe] = 0x33
      cpu.registers.SP = 0xfd
      cpu.fetchAddress()
      branch.RTS(cpu)

      expect(cpu.registers.PC).toBe(0x1234)
    })
  })

  definitions.forEach(({ instruction, flagToTest, jumpIfFlagIs }) => {
    describe(instruction, () => {
      it(`should change PC if ${flagToTest} flags is ${
        jumpIfFlagIs ? 'on' : 'off'
      }`, () => {
        const cpu = new CPU([0x02, 0, 0, 0])
        cpu.bus = {
          cpuRead(addr) {
            return cpu.ram[addr]
          },
          cpuWrite(addr, value) {
            cpu.ram[addr] = value
          }
        }
        cpu.registers.PC = 0
        cpu.registers.STATUS[flagToTest] = jumpIfFlagIs
        cpu.fetchAddress({ relativeAddress: 2 })
        branch[instruction](cpu)

        expect(cpu.registers.PC).toBe(0x02)
        expect(cpu.cycles).toBe(1)
      })

      it(`should change not PC if ${flagToTest} flags is ${
        jumpIfFlagIs ? 'off' : 'on'
      }`, () => {
        const cpu = new CPU([0x02, 0, 0, 0])
        cpu.bus = {
          cpuRead(addr) {
            return cpu.ram[addr]
          },
          cpuWrite(addr, value) {
            cpu.ram[addr] = value
          }
        }
        cpu.registers.PC = 0
        cpu.registers.STATUS[flagToTest] = !jumpIfFlagIs
        cpu.fetchAddress({ relativeAddress: 2 })
        branch[instruction](cpu)

        expect(cpu.registers.PC).toBe(0x00)
      })

      it('should add additional clock cycle if page is changed', () => {
        const cpu = new CPU([0x02, 0, 0, 0])
        cpu.bus = {
          cpuRead(addr) {
            return cpu.ram[addr]
          },
          cpuWrite(addr, value) {
            cpu.ram[addr] = value
          }
        }
        cpu.registers.PC = 0x10ff
        cpu.registers.STATUS[flagToTest] = jumpIfFlagIs
        cpu.fetchAddress({ relativeAddress: 1 })
        branch[instruction](cpu)

        expect(cpu.registers.PC).toBe(0x1100)
        expect(cpu.cycles).toBe(2)
      })
    })
  })
})
