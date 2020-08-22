import ABS from './addressings/absolute'
import REL from './addressings/relative'
import IMM from './addressings/immediate'
import IND from './addressings/indirect'
import IZX from './addressings/indexed-indirect'
import IZY from './addressings/indirect-indexed'
import ZP0 from './addressings/zero-page'
import IMP from './addressings/implicit'
import { ADC, SBC } from './operations/arithmatic'
import { ORA, AND, ASL } from './operations/bitwise'
import { BCC, BCS, BEQ, BNE, BMI, BPL, BVS, BVC } from './operations/branch'

const NOP = () => {}

const ABX = (cpu) => ABS(cpu, 'X')

const ABY = (cpu) => ABS(cpu, 'Y')

const ZPX = (cpu) => ZP0(cpu, 'X')

const ZPY = (cpu) => ZP0(cpu, 'Y')

export default {
  0: {
    name: 'BRK',
    operator: NOP,
    addressing: IMM,
    cycles: 7
  },
  1: {
    name: 'ORA',
    operator: ORA,
    addressing: IZX,
    cycles: 6
  },
  2: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  3: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  4: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  5: {
    name: 'ORA',
    operator: ORA,
    addressing: ZP0,
    cycles: 3
  },
  6: {
    name: 'ASL',
    operator: ASL,
    addressing: ZP0,
    cycles: 5
  },
  7: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  8: {
    name: 'PHP',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  9: {
    name: 'ORA',
    operator: ORA,
    addressing: IMM,
    cycles: 2
  },
  10: {
    name: 'ASL',
    operator: ASL,
    addressing: IMP,
    cycles: 2
  },
  11: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  12: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  13: {
    name: 'ORA',
    operator: ORA,
    addressing: ABS,
    cycles: 4
  },
  14: {
    name: 'ASL',
    operator: ASL,
    addressing: ABS,
    cycles: 6
  },
  15: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  16: {
    name: 'BPL',
    operator: BPL,
    addressing: REL,
    cycles: 2
  },
  17: {
    name: 'ORA',
    operator: ORA,
    addressing: IZY,
    cycles: 5
  },
  18: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  19: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  20: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  21: {
    name: 'ORA',
    operator: ORA,
    addressing: ZPX,
    cycles: 4
  },
  22: {
    name: 'ASL',
    operator: ASL,
    addressing: ZPX,
    cycles: 6
  },
  23: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  24: {
    name: 'CLC',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  25: {
    name: 'ORA',
    operator: ORA,
    addressing: ABY,
    cycles: 4
  },
  26: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  27: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  28: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  29: {
    name: 'ORA',
    operator: ORA,
    addressing: ABX,
    cycles: 4
  },
  30: {
    name: 'ASL',
    operator: ASL,
    addressing: ABX,
    cycles: 7
  },
  31: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  32: {
    name: 'JSR',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  33: {
    name: 'AND',
    operator: AND,
    addressing: IZX,
    cycles: 6
  },
  34: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  35: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  36: {
    name: 'BIT',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  37: {
    name: 'AND',
    operator: AND,
    addressing: ZP0,
    cycles: 3
  },
  38: {
    name: 'ROL',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  39: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  40: {
    name: 'PLP',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  41: {
    name: 'AND',
    operator: AND,
    addressing: IMM,
    cycles: 2
  },
  42: {
    name: 'ROL',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  43: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  44: {
    name: 'BIT',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  45: {
    name: 'AND',
    operator: AND,
    addressing: ABS,
    cycles: 4
  },
  46: {
    name: 'ROL',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  47: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  48: {
    name: 'BMI',
    operator: BMI,
    addressing: REL,
    cycles: 2
  },
  49: {
    name: 'AND',
    operator: AND,
    addressing: IZY,
    cycles: 5
  },
  50: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  51: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  52: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  53: {
    name: 'AND',
    operator: AND,
    addressing: ZPX,
    cycles: 4
  },
  54: {
    name: 'ROL',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  55: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  56: {
    name: 'SEC',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  57: {
    name: 'AND',
    operator: AND,
    addressing: ABY,
    cycles: 4
  },
  58: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  59: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  60: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  61: {
    name: 'AND',
    operator: AND,
    addressing: ABX,
    cycles: 4
  },
  62: {
    name: 'ROL',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  63: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  64: {
    name: 'RTI',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  65: {
    name: 'EOR',
    operator: NOP,
    addressing: IZX,
    cycles: 6
  },
  66: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  67: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  68: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  69: {
    name: 'EOR',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  70: {
    name: 'LSR',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  71: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  72: {
    name: 'PHA',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  73: {
    name: 'EOR',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  74: {
    name: 'LSR',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  75: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  76: {
    name: 'JMP',
    operator: NOP,
    addressing: ABS,
    cycles: 3
  },
  77: {
    name: 'EOR',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  78: {
    name: 'LSR',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  79: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  80: {
    name: 'BVC',
    operator: BVC,
    addressing: REL,
    cycles: 2
  },
  81: {
    name: 'EOR',
    operator: NOP,
    addressing: IZY,
    cycles: 5
  },
  82: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  83: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  84: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  85: {
    name: 'EOR',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  86: {
    name: 'LSR',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  87: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  88: {
    name: 'CLI',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  89: {
    name: 'EOR',
    operator: NOP,
    addressing: ABY,
    cycles: 4
  },
  90: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  91: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  92: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  93: {
    name: 'EOR',
    operator: NOP,
    addressing: ABX,
    cycles: 4
  },
  94: {
    name: 'LSR',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  95: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  96: {
    name: 'RTS',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  97: {
    name: 'ADC',
    operator: ADC,
    addressing: IZX,
    cycles: 6
  },
  98: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  99: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  100: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  101: {
    name: 'ADC',
    operator: ADC,
    addressing: ZP0,
    cycles: 3
  },
  102: {
    name: 'ROR',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  103: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  104: {
    name: 'PLA',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  105: {
    name: 'ADC',
    operator: ADC,
    addressing: IMM,
    cycles: 2
  },
  106: {
    name: 'ROR',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  107: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  108: {
    name: 'JMP',
    operator: NOP,
    addressing: IND,
    cycles: 5
  },
  109: {
    name: 'ADC',
    operator: ADC,
    addressing: ABS,
    cycles: 4
  },
  110: {
    name: 'ROR',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  111: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  112: {
    name: 'BVS',
    operator: BVS,
    addressing: REL,
    cycles: 2
  },
  113: {
    name: 'ADC',
    operator: ADC,
    addressing: IZY,
    cycles: 5
  },
  114: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  115: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  116: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  117: {
    name: 'ADC',
    operator: ADC,
    addressing: ZPX,
    cycles: 4
  },
  118: {
    name: 'ROR',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  119: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  120: {
    name: 'SEI',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  121: {
    name: 'ADC',
    operator: ADC,
    addressing: ABY,
    cycles: 4
  },
  122: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  123: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  124: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  125: {
    name: 'ADC',
    operator: ADC,
    addressing: ABX,
    cycles: 4
  },
  126: {
    name: 'ROR',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  127: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  128: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  129: {
    name: 'STA',
    operator: NOP,
    addressing: IZX,
    cycles: 6
  },
  130: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  131: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  132: {
    name: 'STY',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  133: {
    name: 'STA',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  134: {
    name: 'STX',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  135: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  136: {
    name: 'DEY',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  137: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  138: {
    name: 'TXA',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  139: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  140: {
    name: 'STY',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  141: {
    name: 'STA',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  142: {
    name: 'STX',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  143: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  144: {
    name: 'BCC',
    operator: BCC,
    addressing: REL,
    cycles: 2
  },
  145: {
    name: 'STA',
    operator: NOP,
    addressing: IZY,
    cycles: 6
  },
  146: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  147: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  148: {
    name: 'STY',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  149: {
    name: 'STA',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  150: {
    name: 'STX',
    operator: NOP,
    addressing: ZPY,
    cycles: 4
  },
  151: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  152: {
    name: 'TYA',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  153: {
    name: 'STA',
    operator: NOP,
    addressing: ABY,
    cycles: 5
  },
  154: {
    name: 'TXS',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  155: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  156: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  157: {
    name: 'STA',
    operator: NOP,
    addressing: ABX,
    cycles: 5
  },
  158: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  159: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  160: {
    name: 'LDY',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  161: {
    name: 'LDA',
    operator: NOP,
    addressing: IZX,
    cycles: 6
  },
  162: {
    name: 'LDX',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  163: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  164: {
    name: 'LDY',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  165: {
    name: 'LDA',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  166: {
    name: 'LDX',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  167: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 3
  },
  168: {
    name: 'TAY',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  169: {
    name: 'LDA',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  170: {
    name: 'TAX',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  171: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  172: {
    name: 'LDY',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  173: {
    name: 'LDA',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  174: {
    name: 'LDX',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  175: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  176: {
    name: 'BCS',
    operator: BCS,
    addressing: REL,
    cycles: 2
  },
  177: {
    name: 'LDA',
    operator: NOP,
    addressing: IZY,
    cycles: 5
  },
  178: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  179: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  180: {
    name: 'LDY',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  181: {
    name: 'LDA',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  182: {
    name: 'LDX',
    operator: NOP,
    addressing: ZPY,
    cycles: 4
  },
  183: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  184: {
    name: 'CLV',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  185: {
    name: 'LDA',
    operator: NOP,
    addressing: ABY,
    cycles: 4
  },
  186: {
    name: 'TSX',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  187: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  188: {
    name: 'LDY',
    operator: NOP,
    addressing: ABX,
    cycles: 4
  },
  189: {
    name: 'LDA',
    operator: NOP,
    addressing: ABX,
    cycles: 4
  },
  190: {
    name: 'LDX',
    operator: NOP,
    addressing: ABY,
    cycles: 4
  },
  191: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  192: {
    name: 'CPY',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  193: {
    name: 'CMP',
    operator: NOP,
    addressing: IZX,
    cycles: 6
  },
  194: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  195: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  196: {
    name: 'CPY',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  197: {
    name: 'CMP',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  198: {
    name: 'DEC',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  199: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  200: {
    name: 'INY',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  201: {
    name: 'CMP',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  202: {
    name: 'DEX',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  203: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  204: {
    name: 'CPY',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  205: {
    name: 'CMP',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  206: {
    name: 'DEC',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  207: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  208: {
    name: 'BNE',
    operator: BNE,
    addressing: REL,
    cycles: 2
  },
  209: {
    name: 'CMP',
    operator: NOP,
    addressing: IZY,
    cycles: 5
  },
  210: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  211: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  212: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  213: {
    name: 'CMP',
    operator: NOP,
    addressing: ZPX,
    cycles: 4
  },
  214: {
    name: 'DEC',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  215: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  216: {
    name: 'CLD',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  217: {
    name: 'CMP',
    operator: NOP,
    addressing: ABY,
    cycles: 4
  },
  218: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  219: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  220: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  221: {
    name: 'CMP',
    operator: NOP,
    addressing: ABX,
    cycles: 4
  },
  222: {
    name: 'DEC',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  223: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  224: {
    name: 'CPX',
    operator: NOP,
    addressing: IMM,
    cycles: 2
  },
  225: {
    name: 'SBC',
    operator: SBC,
    addressing: IZX,
    cycles: 6
  },
  226: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  227: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  228: {
    name: 'CPX',
    operator: NOP,
    addressing: ZP0,
    cycles: 3
  },
  229: {
    name: 'SBC',
    operator: SBC,
    addressing: ZP0,
    cycles: 3
  },
  230: {
    name: 'INC',
    operator: NOP,
    addressing: ZP0,
    cycles: 5
  },
  231: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 5
  },
  232: {
    name: 'INX',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  233: {
    name: 'SBC',
    operator: SBC,
    addressing: IMM,
    cycles: 2
  },
  234: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  235: {
    name: '???',
    operator: SBC,
    addressing: IMP,
    cycles: 2
  },
  236: {
    name: 'CPX',
    operator: NOP,
    addressing: ABS,
    cycles: 4
  },
  237: {
    name: 'SBC',
    operator: SBC,
    addressing: ABS,
    cycles: 4
  },
  238: {
    name: 'INC',
    operator: NOP,
    addressing: ABS,
    cycles: 6
  },
  239: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  240: {
    name: 'BEQ',
    operator: BEQ,
    addressing: REL,
    cycles: 2
  },
  241: {
    name: 'SBC',
    operator: SBC,
    addressing: IZY,
    cycles: 5
  },
  242: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  243: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 8
  },
  244: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  245: {
    name: 'SBC',
    operator: SBC,
    addressing: ZPX,
    cycles: 4
  },
  246: {
    name: 'INC',
    operator: NOP,
    addressing: ZPX,
    cycles: 6
  },
  247: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 6
  },
  248: {
    name: 'SED',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  249: {
    name: 'SBC',
    operator: SBC,
    addressing: ABY,
    cycles: 4
  },
  250: {
    name: 'NOP',
    operator: NOP,
    addressing: IMP,
    cycles: 2
  },
  251: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  },
  252: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 4
  },
  253: {
    name: 'SBC',
    operator: SBC,
    addressing: ABX,
    cycles: 4
  },
  254: {
    name: 'INC',
    operator: NOP,
    addressing: ABX,
    cycles: 7
  },
  255: {
    name: '???',
    operator: NOP,
    addressing: IMP,
    cycles: 7
  }
}
