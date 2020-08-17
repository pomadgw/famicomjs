/* eslint-disable no-unused-vars */
import abs from './addressings/absolute'
import rel from './addressings/relative'
import imm from './addressings/immediate'
import ind from './addressings/indirect'
import inx from './addressings/indexed-indirect'
import iny from './addressings/indirect-indexed'
import zpg from './addressings/zero-page'

import { ORA } from './operations/bitwise'

export default {
  0x05: {
    addressing: zpg,
    operator: ORA
  },
  0x09: {
    addressing: imm,
    operator: ORA
  },
  0x0d: {
    addressing: abs,
    operator: ORA
  },
  0x15: {
    addressing: (cpu) => zpg(cpu, 'X'),
    operator: ORA
  }
}
