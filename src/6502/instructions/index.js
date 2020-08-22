/* eslint-disable no-unused-vars */
import ABS from './addressings/absolute'
import REL from './addressings/relative'
import IMM from './addressings/immediate'
import IND from './addressings/indirect'
import INX from './addressings/indexed-indirect'
import INY from './addressings/indirect-indexed'
import ZPG from './addressings/zero-page'
import IMP from './addressings/implicit'

import * as bitwise from './operations/bitwise'

import opcodes from './opcodes.json'

const NOP = () => {}

const addressingTable = {
  IMM,
  ABS,
  ABX: (cpu) => ABS(cpu, 'X'),
  ABY: (cpu) => ABS(cpu, 'Y'),
  REL,
  IND,
  IMP,
  ZP0: ZPG,
  ZPX: (cpu) => ZPG(cpu, 'X'),
  ZPY: (cpu) => ZPG(cpu, 'Y')
}

const generateOpcodeTable = () => {
  const result = {}
  // eslint-disable-next-line camelcase
  opcodes.forEach(({ name, operate, addr_mode, cycles }, index) => {
    result[index] = {
      name,
      operator: bitwise[operate.toUpperCase()] ?? NOP,
      addressing: addressingTable[addr_mode],
      cycles
    }
  })

  return result
}

export default generateOpcodeTable()

// export default {
//   0x05: {
//     addressing: zpg,
//     operator: ORA
//   },
//   0x09: {
//     addressing: imm,
//     operator: ORA
//   },
//   0x0d: {
//     addressing: abs,
//     operator: ORA
//   },
//   0x15: {
//     addressing: (cpu) => zpg(cpu, 'X'),
//     operator: ORA
//   }
// }
