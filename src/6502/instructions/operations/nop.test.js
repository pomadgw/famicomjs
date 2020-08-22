import { NOP } from './nop'
import CPU from '../../cpu'

describe('instruction: NOP', () => {
  it('should return 0 cycles', () => {
    const cpu = new CPU([0])

    expect(NOP(cpu)).toBe(0)
  })

  it('should return 1 cycles for certain opcodes', () => {
    const cpu = new CPU([0])

    ;[0x1c, 0x3c, 0x5c, 0x7c, 0xdc, 0xfc].forEach((opcode) => {
      cpu.opcode = opcode
      expect(NOP(cpu)).toBe(1)
    })
  })
})
