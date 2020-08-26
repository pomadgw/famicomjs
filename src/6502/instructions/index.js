import ABS from './addressings/absolute'
import REL from './addressings/relative'
import IMM from './addressings/immediate'
import IND from './addressings/indirect'
import IZX from './addressings/indexed-indirect'
import IZY from './addressings/indirect-indexed'
import ZP0 from './addressings/zero-page'
import IMP from './addressings/implicit'
import { ADC, SBC, DEC, DEX, DEY, INC, INX, INY } from './operations/arithmatic'
import { ORA, AND, EOR, ASL, BIT, LSR, ROL, ROR } from './operations/bitwise'
import {
  BCC,
  BCS,
  BEQ,
  BNE,
  BMI,
  BPL,
  BVS,
  BVC,
  JMP,
  JSR,
  RTS
} from './operations/branch'
import { CLC, CLD, CLI, CLV } from './operations/clear'
import { CMP, CPX, CPY } from './operations/comparison'
import { BRK, RTI } from './operations/interrupts'
import { LDA, LDX, LDY, STA, STX, STY } from './operations/memory'
import { NOP } from './operations/nop'
import { TAX, TAY, TXA, TYA } from './operations/register'
import { PHA, PLA, PHP, PLP, TXS, TSX } from './operations/stack'

const ABX = (cpu) => ABS(cpu, 'X')

const ABY = (cpu) => ABS(cpu, 'Y')

const ZPX = (cpu) => ZP0(cpu, 'X')

const ZPY = (cpu) => ZP0(cpu, 'Y')

const XXX = () => 0

export default {
  0x00: {
    name: 'BRK',
    operator: BRK,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x01: {
    name: 'ORA',
    operator: ORA,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0x02: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x03: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x04: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 3
  },
  0x05: {
    name: 'ORA',
    operator: ORA,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x06: {
    name: 'ASL',
    operator: ASL,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 5
  },
  0x07: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0x08: {
    name: 'PHP',
    operator: PHP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 3
  },
  0x09: {
    name: 'ORA',
    operator: ORA,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0x0a: {
    name: 'ASL',
    operator: ASL,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x0b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x0c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x0d: {
    name: 'ORA',
    operator: ORA,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x0e: {
    name: 'ASL',
    operator: ASL,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 6
  },
  0x0f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x10: {
    name: 'BPL',
    operator: BPL,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0x11: {
    name: 'ORA',
    operator: ORA,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 5
  },
  0x12: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x13: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x14: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x15: {
    name: 'ORA',
    operator: ORA,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0x16: {
    name: 'ASL',
    operator: ASL,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 6
  },
  0x17: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x18: {
    name: 'CLC',
    operator: CLC,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x19: {
    name: 'ORA',
    operator: ORA,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0x1a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x1b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x1c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x1d: {
    name: 'ORA',
    operator: ORA,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0x1e: {
    name: 'ASL',
    operator: ASL,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 7
  },
  0x1f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x20: {
    name: 'JSR',
    operator: JSR,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 6
  },
  0x21: {
    name: 'AND',
    operator: AND,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0x22: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x23: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x24: {
    name: 'BIT',
    operator: BIT,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x25: {
    name: 'AND',
    operator: AND,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x26: {
    name: 'ROL',
    operator: ROL,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 5
  },
  0x27: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0x28: {
    name: 'PLP',
    operator: PLP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x29: {
    name: 'AND',
    operator: AND,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0x2a: {
    name: 'ROL',
    operator: ROL,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x2b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x2c: {
    name: 'BIT',
    operator: BIT,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x2d: {
    name: 'AND',
    operator: AND,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x2e: {
    name: 'ROL',
    operator: ROL,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 6
  },
  0x2f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x30: {
    name: 'BMI',
    operator: BMI,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0x31: {
    name: 'AND',
    operator: AND,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 5
  },
  0x32: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x33: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x34: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x35: {
    name: 'AND',
    operator: AND,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0x36: {
    name: 'ROL',
    operator: ROL,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 6
  },
  0x37: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x38: {
    name: 'SEC',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x39: {
    name: 'AND',
    operator: AND,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0x3a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x3b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x3c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x3d: {
    name: 'AND',
    operator: AND,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0x3e: {
    name: 'ROL',
    operator: ROL,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 7
  },
  0x3f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x40: {
    name: 'RTI',
    operator: RTI,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x41: {
    name: 'EOR',
    operator: EOR,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0x42: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x43: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x44: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 3
  },
  0x45: {
    name: 'EOR',
    operator: EOR,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x46: {
    name: 'LSR',
    operator: LSR,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 5
  },
  0x47: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0x48: {
    name: 'PHA',
    operator: PHA,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 3
  },
  0x49: {
    name: 'EOR',
    operator: EOR,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0x4a: {
    name: 'LSR',
    operator: LSR,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x4b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x4c: {
    name: 'JMP',
    operator: JMP,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 3
  },
  0x4d: {
    name: 'EOR',
    operator: EOR,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x4e: {
    name: 'LSR',
    operator: LSR,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 6
  },
  0x4f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x50: {
    name: 'BVC',
    operator: BVC,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0x51: {
    name: 'EOR',
    operator: EOR,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 5
  },
  0x52: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x53: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x54: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x55: {
    name: 'EOR',
    operator: EOR,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0x56: {
    name: 'LSR',
    operator: LSR,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 6
  },
  0x57: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x58: {
    name: 'CLI',
    operator: CLI,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x59: {
    name: 'EOR',
    operator: EOR,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0x5a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x5b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x5c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x5d: {
    name: 'EOR',
    operator: EOR,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0x5e: {
    name: 'LSR',
    operator: LSR,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 7
  },
  0x5f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x60: {
    name: 'RTS',
    operator: RTS,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x61: {
    name: 'ADC',
    operator: ADC,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0x62: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x63: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x64: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 3
  },
  0x65: {
    name: 'ADC',
    operator: ADC,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x66: {
    name: 'ROR',
    operator: ROR,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 5
  },
  0x67: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0x68: {
    name: 'PLA',
    operator: PLA,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x69: {
    name: 'ADC',
    operator: ADC,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0x6a: {
    name: 'ROR',
    operator: ROR,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x6b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x6c: {
    name: 'JMP',
    operator: JMP,
    addressing: IND,
    addressingName: 'IND',
    cycles: 5
  },
  0x6d: {
    name: 'ADC',
    operator: ADC,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x6e: {
    name: 'ROR',
    operator: ROR,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 6
  },
  0x6f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x70: {
    name: 'BVS',
    operator: BVS,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0x71: {
    name: 'ADC',
    operator: ADC,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 5
  },
  0x72: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x73: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0x74: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x75: {
    name: 'ADC',
    operator: ADC,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0x76: {
    name: 'ROR',
    operator: ROR,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 6
  },
  0x77: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x78: {
    name: 'SEI',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x79: {
    name: 'ADC',
    operator: ADC,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0x7a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x7b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x7c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x7d: {
    name: 'ADC',
    operator: ADC,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0x7e: {
    name: 'ROR',
    operator: ROR,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 7
  },
  0x7f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0x80: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x81: {
    name: 'STA',
    operator: STA,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0x82: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x83: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x84: {
    name: 'STY',
    operator: STY,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x85: {
    name: 'STA',
    operator: STA,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x86: {
    name: 'STX',
    operator: STX,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0x87: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 3
  },
  0x88: {
    name: 'DEY',
    operator: DEY,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x89: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x8a: {
    name: 'TXA',
    operator: TXA,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x8b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x8c: {
    name: 'STY',
    operator: STY,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x8d: {
    name: 'STA',
    operator: STA,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x8e: {
    name: 'STX',
    operator: STX,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0x8f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x90: {
    name: 'BCC',
    operator: BCC,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0x91: {
    name: 'STA',
    operator: STA,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 6
  },
  0x92: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x93: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0x94: {
    name: 'STY',
    operator: STY,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0x95: {
    name: 'STA',
    operator: STA,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0x96: {
    name: 'STX',
    operator: STX,
    addressing: ZPY,
    addressingName: 'ZPY',
    cycles: 4
  },
  0x97: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0x98: {
    name: 'TYA',
    operator: TYA,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x99: {
    name: 'STA',
    operator: STA,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 5
  },
  0x9a: {
    name: 'TXS',
    operator: TXS,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0x9b: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0x9c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0x9d: {
    name: 'STA',
    operator: STA,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 5
  },
  0x9e: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0x9f: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0xa0: {
    name: 'LDY',
    operator: LDY,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0xa1: {
    name: 'LDA',
    operator: LDA,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0xa2: {
    name: 'LDX',
    operator: LDX,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0xa3: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0xa4: {
    name: 'LDY',
    operator: LDY,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0xa5: {
    name: 'LDA',
    operator: LDA,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0xa6: {
    name: 'LDX',
    operator: LDX,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0xa7: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 3
  },
  0xa8: {
    name: 'TAY',
    operator: TAY,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xa9: {
    name: 'LDA',
    operator: LDA,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0xaa: {
    name: 'TAX',
    operator: TAX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xab: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xac: {
    name: 'LDY',
    operator: LDY,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0xad: {
    name: 'LDA',
    operator: LDA,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0xae: {
    name: 'LDX',
    operator: LDX,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0xaf: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xb0: {
    name: 'BCS',
    operator: BCS,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0xb1: {
    name: 'LDA',
    operator: LDA,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 5
  },
  0xb2: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xb3: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0xb4: {
    name: 'LDY',
    operator: LDY,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0xb5: {
    name: 'LDA',
    operator: LDA,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0xb6: {
    name: 'LDX',
    operator: LDX,
    addressing: ZPY,
    addressingName: 'ZPY',
    cycles: 4
  },
  0xb7: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xb8: {
    name: 'CLV',
    operator: CLV,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xb9: {
    name: 'LDA',
    operator: LDA,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0xba: {
    name: 'TSX',
    operator: TSX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xbb: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xbc: {
    name: 'LDY',
    operator: LDY,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0xbd: {
    name: 'LDA',
    operator: LDA,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0xbe: {
    name: 'LDX',
    operator: LDX,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0xbf: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xc0: {
    name: 'CPY',
    operator: CPY,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0xc1: {
    name: 'CMP',
    operator: CMP,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0xc2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xc3: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0xc4: {
    name: 'CPY',
    operator: CPY,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0xc5: {
    name: 'CMP',
    operator: CMP,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0xc6: {
    name: 'DEC',
    operator: DEC,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 5
  },
  0xc7: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0xc8: {
    name: 'INY',
    operator: INY,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xc9: {
    name: 'CMP',
    operator: CMP,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0xca: {
    name: 'DEX',
    operator: DEX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xcb: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xcc: {
    name: 'CPY',
    operator: CPY,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0xcd: {
    name: 'CMP',
    operator: CMP,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0xce: {
    name: 'DEC',
    operator: DEC,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 6
  },
  0xcf: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0xd0: {
    name: 'BNE',
    operator: BNE,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0xd1: {
    name: 'CMP',
    operator: CMP,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 5
  },
  0xd2: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xd3: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0xd4: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xd5: {
    name: 'CMP',
    operator: CMP,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0xd6: {
    name: 'DEC',
    operator: DEC,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 6
  },
  0xd7: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0xd8: {
    name: 'CLD',
    operator: CLD,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xd9: {
    name: 'CMP',
    operator: CMP,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0xda: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xdb: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0xdc: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xdd: {
    name: 'CMP',
    operator: CMP,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0xde: {
    name: 'DEC',
    operator: DEC,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 7
  },
  0xdf: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0xe0: {
    name: 'CPX',
    operator: CPX,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0xe1: {
    name: 'SBC',
    operator: SBC,
    addressing: IZX,
    addressingName: 'IZX',
    cycles: 6
  },
  0xe2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xe3: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0xe4: {
    name: 'CPX',
    operator: CPX,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0xe5: {
    name: 'SBC',
    operator: SBC,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 3
  },
  0xe6: {
    name: 'INC',
    operator: INC,
    addressing: ZP0,
    addressingName: 'ZP0',
    cycles: 5
  },
  0xe7: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 5
  },
  0xe8: {
    name: 'INX',
    operator: INX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xe9: {
    name: 'SBC',
    operator: SBC,
    addressing: IMM,
    addressingName: 'IMM',
    cycles: 2
  },
  0xea: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xeb: {
    name: '???',
    operator: SBC,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xec: {
    name: 'CPX',
    operator: CPX,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0xed: {
    name: 'SBC',
    operator: SBC,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 4
  },
  0xee: {
    name: 'INC',
    operator: INC,
    addressing: ABS,
    addressingName: 'ABS',
    cycles: 6
  },
  0xef: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0xf0: {
    name: 'BEQ',
    operator: BEQ,
    addressing: REL,
    addressingName: 'REL',
    cycles: 2
  },
  0xf1: {
    name: 'SBC',
    operator: SBC,
    addressing: IZY,
    addressingName: 'IZY',
    cycles: 5
  },
  0xf2: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xf3: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 8
  },
  0xf4: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xf5: {
    name: 'SBC',
    operator: SBC,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 4
  },
  0xf6: {
    name: 'INC',
    operator: INC,
    addressing: ZPX,
    addressingName: 'ZPX',
    cycles: 6
  },
  0xf7: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 6
  },
  0xf8: {
    name: 'SED',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xf9: {
    name: 'SBC',
    operator: SBC,
    addressing: ABY,
    addressingName: 'ABY',
    cycles: 4
  },
  0xfa: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 2
  },
  0xfb: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  },
  0xfc: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 4
  },
  0xfd: {
    name: 'SBC',
    operator: SBC,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 4
  },
  0xfe: {
    name: 'INC',
    operator: INC,
    addressing: ABX,
    addressingName: 'ABX',
    cycles: 7
  },
  0xff: {
    name: '???',
    operator: XXX,
    addressing: IMP,
    addressingName: 'IMP',
    cycles: 7
  }
}
