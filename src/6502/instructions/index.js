import ABS from './addressings/absolute'
import REL from './addressings/relative'
import IMM from './addressings/immediate'
import IND from './addressings/indirect'
import IZX from './addressings/indexed-indirect'
import IZY from './addressings/indirect-indexed'
import ZP0 from './addressings/zero-page'
import IMP from './addressings/implicit'
import { ADC, SBC } from './operations/arithmatic'
import { ORA, AND, ASL, BIT } from './operations/bitwise'
import { BCC, BCS, BEQ, BNE, BMI, BPL, BVS, BVC } from './operations/branch'
import { CLC, CLD, CLI, CLV } from './operations/clear'
import { LDA, LDX, LDY, STA, STX, STY } from './operations/memory'
import { NOP } from './operations/nop'
import { PHA, PLA, PHP, PLP, TXS, TSX } from './operations/stack'

const ABX = (cpu) => ABS(cpu, 'X')

const ABY = (cpu) => ABS(cpu, 'Y')

const ZPX = (cpu) => ZP0(cpu, 'X')

const ZPY = (cpu) => ZP0(cpu, 'Y')

export default {
  0x00: {
    name: 'BRK',
    operator: NOP,
    addressing: IMM,
    cycles: 7
  },
  0x01: {
    name: 'ORA',
    operator: ORA,
    addressing: IZX,
    cycles: 6
  },
  0x02: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x03: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x04: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  0x05: {
    name: 'ORA',
    operator: ORA,
    addressing: ZP0,
    cycles: 3
  },
  0x06: {
    name: 'ASL',
    operator: ASL,
    addressing: ZP0,
    cycles: 5
  },
  0x07: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0x08: {
    name: 'PHP',
    operator: PHP,
    addressing: IMP,
    cycles: 3
  },
  0x09: {
    name: 'ORA',
    operator: ORA,
    addressing: IMM,
    cycles: 2
  },
  0x0a: {
    name: 'ASL',
    operator: ASL,
    addressing: IMP,
    cycles: 2
  },
  0x0b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x0c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x0d: {
    name: 'ORA',
    operator: ORA,
    addressing: ABS,
    cycles: 4
  },
  0x0e: {
    name: 'ASL',
    operator: ASL,
    addressing: ABS,
    cycles: 6
  },
  0x0f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x10: {
    name: 'BPL',
    operator: BPL,
    addressing: REL,
    cycles: 2
  },
  0x11: {
    name: 'ORA',
    operator: ORA,
    addressing: IZY,
    cycles: 5
  },
  0x12: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x13: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x14: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x15: {
    name: 'ORA',
    operator: ORA,
    addressing: ZPX,
    cycles: 4
  },
  0x16: {
    name: 'ASL',
    operator: ASL,
    addressing: ZPX,
    cycles: 6
  },
  0x17: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x18: {
    name: 'CLC',
    operator: CLC,
    addressing: IMP,
    cycles: 2
  },
  0x19: {
    name: 'ORA',
    operator: ORA,
    addressing: ABY,
    cycles: 4
  },
  0x1a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x1b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x1c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x1d: {
    name: 'ORA',
    operator: ORA,
    addressing: ABX,
    cycles: 4
  },
  0x1e: {
    name: 'ASL',
    operator: ASL,
    addressing: ABX,
    cycles: 7
  },
  0x1f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x20: {
    name: 'JSR',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  0x21: {
    name: 'AND',
    operator: AND,
    addressing: IZX,
    cycles: 6
  },
  0x22: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x23: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x24: {
    name: 'BIT',
    operator: BIT,
    addressing: ZP0,
    cycles: 3
  },
  0x25: {
    name: 'AND',
    operator: AND,
    addressing: ZP0,
    cycles: 3
  },
  0x26: {
    name: 'ROL',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  0x27: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0x28: {
    name: 'PLP',
    operator: PLP,
    addressing: IMP,
    cycles: 4
  },
  0x29: {
    name: 'AND',
    operator: AND,
    addressing: IMM,
    cycles: 2
  },
  0x2a: {
    name: 'ROL',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x2b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x2c: {
    name: 'BIT',
    operator: BIT,
    addressing: ABS,
    cycles: 4
  },
  0x2d: {
    name: 'AND',
    operator: AND,
    addressing: ABS,
    cycles: 4
  },
  0x2e: {
    name: 'ROL',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  0x2f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x30: {
    name: 'BMI',
    operator: BMI,
    addressing: REL,
    cycles: 2
  },
  0x31: {
    name: 'AND',
    operator: AND,
    addressing: IZY,
    cycles: 5
  },
  0x32: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x33: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x34: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x35: {
    name: 'AND',
    operator: AND,
    addressing: ZPX,
    cycles: 4
  },
  0x36: {
    name: 'ROL',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  0x37: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x38: {
    name: 'SEC',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x39: {
    name: 'AND',
    operator: AND,
    addressing: ABY,
    cycles: 4
  },
  0x3a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x3b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x3c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x3d: {
    name: 'AND',
    operator: AND,
    addressing: ABX,
    cycles: 4
  },
  0x3e: {
    name: 'ROL',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  0x3f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x40: {
    name: 'RTI',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x41: {
    name: 'EOR',
    operator: NOP,
    addressing: IZX,
    cycles: 6
  },
  0x42: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x43: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x44: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  0x45: {
    name: 'EOR',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  0x46: {
    name: 'LSR',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  0x47: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0x48: {
    name: 'PHA',
    operator: PHA,
    addressing: IMP,
    cycles: 3
  },
  0x49: {
    name: 'EOR',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  0x4a: {
    name: 'LSR',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x4b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x4c: {
    name: 'JMP',
    operator: NOP,
    addressing: ABS,
    cycles: 3
  },
  0x4d: {
    name: 'EOR',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  0x4e: {
    name: 'LSR',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  0x4f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x50: {
    name: 'BVC',
    operator: BVC,
    addressing: REL,
    cycles: 2
  },
  0x51: {
    name: 'EOR',
    operator: NOP,
    addressing: IZY,
    cycles: 5
  },
  0x52: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x53: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x54: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x55: {
    name: 'EOR',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  0x56: {
    name: 'LSR',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  0x57: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x58: {
    name: 'CLI',
    operator: CLI,
    addressing: IMP,
    cycles: 2
  },
  0x59: {
    name: 'EOR',
    operator: NOP,
    addressing: ABY,
    cycles: 4
  },
  0x5a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x5b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x5c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x5d: {
    name: 'EOR',
    operator: NOP,
    addressing: ABX,
    cycles: 4
  },
  0x5e: {
    name: 'LSR',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  0x5f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x60: {
    name: 'RTS',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x61: {
    name: 'ADC',
    operator: ADC,
    addressing: IZX,
    cycles: 6
  },
  0x62: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x63: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x64: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  0x65: {
    name: 'ADC',
    operator: ADC,
    addressing: ZP0,
    cycles: 3
  },
  0x66: {
    name: 'ROR',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  0x67: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0x68: {
    name: 'PLA',
    operator: PLA,
    addressing: IMP,
    cycles: 4
  },
  0x69: {
    name: 'ADC',
    operator: ADC,
    addressing: IMM,
    cycles: 2
  },
  0x6a: {
    name: 'ROR',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x6b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x6c: {
    name: 'JMP',
    operator: NOP,
    addressing: IND,
    cycles: 5
  },
  0x6d: {
    name: 'ADC',
    operator: ADC,
    addressing: ABS,
    cycles: 4
  },
  0x6e: {
    name: 'ROR',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  0x6f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x70: {
    name: 'BVS',
    operator: BVS,
    addressing: REL,
    cycles: 2
  },
  0x71: {
    name: 'ADC',
    operator: ADC,
    addressing: IZY,
    cycles: 5
  },
  0x72: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x73: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0x74: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x75: {
    name: 'ADC',
    operator: ADC,
    addressing: ZPX,
    cycles: 4
  },
  0x76: {
    name: 'ROR',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  0x77: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x78: {
    name: 'SEI',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x79: {
    name: 'ADC',
    operator: ADC,
    addressing: ABY,
    cycles: 4
  },
  0x7a: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x7b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x7c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x7d: {
    name: 'ADC',
    operator: ADC,
    addressing: ABX,
    cycles: 4
  },
  0x7e: {
    name: 'ROR',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  0x7f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0x80: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x81: {
    name: 'STA',
    operator: STA,
    addressing: IZX,
    cycles: 6
  },
  0x82: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x83: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x84: {
    name: 'STY',
    operator: STY,
    addressing: ZP0,
    cycles: 3
  },
  0x85: {
    name: 'STA',
    operator: STA,
    addressing: ZP0,
    cycles: 3
  },
  0x86: {
    name: 'STX',
    operator: STX,
    addressing: ZP0,
    cycles: 3
  },
  0x87: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  0x88: {
    name: 'DEY',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x89: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x8a: {
    name: 'TXA',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x8b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x8c: {
    name: 'STY',
    operator: STY,
    addressing: ABS,
    cycles: 4
  },
  0x8d: {
    name: 'STA',
    operator: STA,
    addressing: ABS,
    cycles: 4
  },
  0x8e: {
    name: 'STX',
    operator: STX,
    addressing: ABS,
    cycles: 4
  },
  0x8f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x90: {
    name: 'BCC',
    operator: BCC,
    addressing: REL,
    cycles: 2
  },
  0x91: {
    name: 'STA',
    operator: STA,
    addressing: IZY,
    cycles: 6
  },
  0x92: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x93: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0x94: {
    name: 'STY',
    operator: STY,
    addressing: ZPX,
    cycles: 4
  },
  0x95: {
    name: 'STA',
    operator: STA,
    addressing: ZPX,
    cycles: 4
  },
  0x96: {
    name: 'STX',
    operator: STX,
    addressing: ZPY,
    cycles: 4
  },
  0x97: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0x98: {
    name: 'TYA',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0x99: {
    name: 'STA',
    operator: STA,
    addressing: ABY,
    cycles: 5
  },
  0x9a: {
    name: 'TXS',
    operator: TXS,
    addressing: IMP,
    cycles: 2
  },
  0x9b: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0x9c: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0x9d: {
    name: 'STA',
    operator: STA,
    addressing: ABX,
    cycles: 5
  },
  0x9e: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0x9f: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0xa0: {
    name: 'LDY',
    operator: LDY,
    addressing: IMM,
    cycles: 2
  },
  0xa1: {
    name: 'LDA',
    operator: LDA,
    addressing: IZX,
    cycles: 6
  },
  0xa2: {
    name: 'LDX',
    operator: LDX,
    addressing: IMM,
    cycles: 2
  },
  0xa3: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0xa4: {
    name: 'LDY',
    operator: LDY,
    addressing: ZP0,
    cycles: 3
  },
  0xa5: {
    name: 'LDA',
    operator: LDA,
    addressing: ZP0,
    cycles: 3
  },
  0xa6: {
    name: 'LDX',
    operator: LDX,
    addressing: ZP0,
    cycles: 3
  },
  0xa7: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  0xa8: {
    name: 'TAY',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xa9: {
    name: 'LDA',
    operator: LDA,
    addressing: IMM,
    cycles: 2
  },
  0xaa: {
    name: 'TAX',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xab: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xac: {
    name: 'LDY',
    operator: LDY,
    addressing: ABS,
    cycles: 4
  },
  0xad: {
    name: 'LDA',
    operator: LDA,
    addressing: ABS,
    cycles: 4
  },
  0xae: {
    name: 'LDX',
    operator: LDX,
    addressing: ABS,
    cycles: 4
  },
  0xaf: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xb0: {
    name: 'BCS',
    operator: BCS,
    addressing: REL,
    cycles: 2
  },
  0xb1: {
    name: 'LDA',
    operator: LDA,
    addressing: IZY,
    cycles: 5
  },
  0xb2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xb3: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0xb4: {
    name: 'LDY',
    operator: LDY,
    addressing: ZPX,
    cycles: 4
  },
  0xb5: {
    name: 'LDA',
    operator: LDA,
    addressing: ZPX,
    cycles: 4
  },
  0xb6: {
    name: 'LDX',
    operator: LDX,
    addressing: ZPY,
    cycles: 4
  },
  0xb7: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xb8: {
    name: 'CLV',
    operator: CLV,
    addressing: IMP,
    cycles: 2
  },
  0xb9: {
    name: 'LDA',
    operator: LDA,
    addressing: ABY,
    cycles: 4
  },
  0xba: {
    name: 'TSX',
    operator: TSX,
    addressing: IMP,
    cycles: 2
  },
  0xbb: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xbc: {
    name: 'LDY',
    operator: LDY,
    addressing: ABX,
    cycles: 4
  },
  0xbd: {
    name: 'LDA',
    operator: LDA,
    addressing: ABX,
    cycles: 4
  },
  0xbe: {
    name: 'LDX',
    operator: LDX,
    addressing: ABY,
    cycles: 4
  },
  0xbf: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xc0: {
    name: 'CPY',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  0xc1: {
    name: 'CMP',
    operator: NOP,
    addressing: IZX,
    cycles: 6
  },
  0xc2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xc3: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0xc4: {
    name: 'CPY',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  0xc5: {
    name: 'CMP',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  0xc6: {
    name: 'DEC',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  0xc7: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0xc8: {
    name: 'INY',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xc9: {
    name: 'CMP',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  0xca: {
    name: 'DEX',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xcb: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xcc: {
    name: 'CPY',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  0xcd: {
    name: 'CMP',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  0xce: {
    name: 'DEC',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  0xcf: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0xd0: {
    name: 'BNE',
    operator: BNE,
    addressing: REL,
    cycles: 2
  },
  0xd1: {
    name: 'CMP',
    operator: NOP,
    addressing: IZY,
    cycles: 5
  },
  0xd2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xd3: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0xd4: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xd5: {
    name: 'CMP',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  0xd6: {
    name: 'DEC',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  0xd7: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0xd8: {
    name: 'CLD',
    operator: CLD,
    addressing: IMP,
    cycles: 2
  },
  0xd9: {
    name: 'CMP',
    operator: NOP,
    addressing: ABY,
    cycles: 4
  },
  0xda: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xdb: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0xdc: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xdd: {
    name: 'CMP',
    operator: NOP,
    addressing: ABX,
    cycles: 4
  },
  0xde: {
    name: 'DEC',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  0xdf: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0xe0: {
    name: 'CPX',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  0xe1: {
    name: 'SBC',
    operator: SBC,
    addressing: IZX,
    cycles: 6
  },
  0xe2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xe3: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0xe4: {
    name: 'CPX',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  0xe5: {
    name: 'SBC',
    operator: SBC,
    addressing: ZP0,
    cycles: 3
  },
  0xe6: {
    name: 'INC',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  0xe7: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  0xe8: {
    name: 'INX',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xe9: {
    name: 'SBC',
    operator: SBC,
    addressing: IMM,
    cycles: 2
  },
  0xea: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xeb: {
    name: '???',
    operator: SBC,
    addressing: IMP,
    cycles: 2
  },
  0xec: {
    name: 'CPX',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  0xed: {
    name: 'SBC',
    operator: SBC,
    addressing: ABS,
    cycles: 4
  },
  0xee: {
    name: 'INC',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  0xef: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0xf0: {
    name: 'BEQ',
    operator: BEQ,
    addressing: REL,
    cycles: 2
  },
  0xf1: {
    name: 'SBC',
    operator: SBC,
    addressing: IZY,
    cycles: 5
  },
  0xf2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xf3: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  0xf4: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xf5: {
    name: 'SBC',
    operator: SBC,
    addressing: ZPX,
    cycles: 4
  },
  0xf6: {
    name: 'INC',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  0xf7: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  0xf8: {
    name: 'SED',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xf9: {
    name: 'SBC',
    operator: SBC,
    addressing: ABY,
    cycles: 4
  },
  0xfa: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  0xfb: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  0xfc: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  0xfd: {
    name: 'SBC',
    operator: SBC,
    addressing: ABX,
    cycles: 4
  },
  0xfe: {
    name: 'INC',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  0xff: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  }
}
