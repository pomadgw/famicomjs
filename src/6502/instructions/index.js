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
import * as arithmatic from './operations/arithmatic'

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
  INX,
  INY,
  ZP0: ZPG,
  ZPX: (cpu) => ZPG(cpu, 'X'),
  ZPY: (cpu) => ZPG(cpu, 'Y')
}

const generateOpcodeTable = () => {
  const result = {}
  // eslint-disable-next-line camelcase
  opcodes.forEach(({ name, operate, addr_mode, cycles }, index) => {
    const opKey = operate.toUpperCase()
    result[index] = {
      name,
      operator: bitwise[opKey] ?? arithmatic[opKey] ?? NOP,
      addressing: addressingTable[addr_mode],
      cycles
    }
  })

  return result
}

export default generateOpcodeTable()
