import opcodes from '../instructions'
import { toUint8 } from '../utils'

const branchingOperators = [
  'bcc',
  'bcs',
  'beq',
  'bne',
  'bmi',
  'bpl',
  'bvs',
  'bvc'
]

export function compileParam(string) {
  const result = /\(?(#)?(\$?)([\da-f]+)\)?(?:,([xy]))?\)?/.exec(
    string.toLowerCase()
  )

  let params
  let addressingMode = 'IMP'

  if (!result || string.toLowerCase() === 'a') {
    return { params: [], addressingMode }
  }

  const useIndirect = /\(\$[\da-f]+\)/.exec(string.toLowerCase())
  const useInxInd = /\(\$[\da-f]+,x\)/.exec(string.toLowerCase())
  const useIndInx = /\(\$[\da-f]+\),y/.exec(string.toLowerCase())

  const [, isImmediate, isHex, numberString, offsetRegister] = result

  const number = isHex ? parseInt(numberString, 16) : parseInt(numberString, 10)

  const is8bitParam = numberString.length <= 2

  if (isImmediate || is8bitParam) {
    params = [number]
  } else {
    params = [number & 0xff, (number >> 8) & 0xff]
  }

  if (isImmediate) {
    addressingMode = 'IMM'
  } else if (!is8bitParam && useIndirect) {
    addressingMode = 'IND'
  } else if (useInxInd) {
    addressingMode = 'IZX'
  } else if (useIndInx) {
    addressingMode = 'IZY'
  } else if (offsetRegister) {
    addressingMode = is8bitParam
      ? `ZP${offsetRegister.toUpperCase()}`
      : `AB${offsetRegister.toUpperCase()}`
  } else {
    addressingMode = is8bitParam ? 'ZP0' : 'ABS'
  }

  return { params, addressingMode }
}

export function assembleLine(string) {
  const lowerString = string.toLowerCase()
  const [, instruction, rawParams] = /([a-z]+)(\s+.+?)?$/.exec(lowerString)
  let { params, addressingMode } = compileParam((rawParams ?? '').trim())

  if (branchingOperators.includes(instruction)) {
    addressingMode = 'REL'
  }

  const opcode = Object.entries(opcodes).find(
    ([, value]) =>
      value.name.toLowerCase() === instruction &&
      value.addressingName === addressingMode
  )

  return [Number(opcode[0]), ...params]
}

export function labelLines(lines) {
  const result = []
  let offset = 0

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i]
    const label = /\s*(.+?):\s*(.+)?$/.exec(currentLine.trim())

    if (label) {
      if (i + 1 === lines.length && !label[2]) {
        throw new Error('Label without associated instruction')
      }

      if (!label[2]) {
        i += 1
      }

      const instruction = label[2]?.trim() ?? lines[i]
      let byteLength = 1
      const operator = instruction.split(/\s+/)

      if (operator[0].toLowerCase() === 'jmp' && !/\(.+?\)/.test(operator[1])) {
        byteLength = 3
      } else if (branchingOperators.includes(operator[0].toLowerCase())) {
        byteLength = 2
      } else {
        byteLength = assembleLine(instruction).length
      }

      result.push([offset, label[2]?.trim() ?? lines[i], label[1]])
      offset += byteLength
    } else {
      let byteLength = 1
      const operator = currentLine.split(/\s+/)

      if (operator[0].toLowerCase() === 'jmp' && !/\(.+?\)/.test(operator[1])) {
        byteLength = 3
      } else if (branchingOperators.includes(operator[0].toLowerCase())) {
        byteLength = 2
      } else {
        byteLength = assembleLine(currentLine).length
      }

      result.push([offset, currentLine, undefined])
      offset += byteLength
    }
  }

  return result
}

export function compileLabelToAddress(lines, pc = 0) {
  const labels = {}

  lines.forEach(([lineNo, , label]) => {
    if (label) {
      labels[label] = lineNo
    }
  })

  const result = []

  lines.forEach(([lineNo, instruction, label]) => {
    const [operator, params] = instruction.split(/\s+/)
    if (labels[params] != null) {
      if (branchingOperators.includes(operator.toLowerCase())) {
        const relativeAddress = toUint8(labels[params] - lineNo - 2)
        instruction = `${operator} $${relativeAddress
          .toString(16)
          .padStart(2, '0')}`
      } else {
        const absoluteAddress = pc + labels[params]
        instruction = `${operator} $${absoluteAddress
          .toString(16)
          .padStart(4, '0')}`
      }
    }
    result.push([lineNo, instruction, label])
  })

  return result
}

export function assemble(string, pc = 0) {
  let lines = string
    .trim()
    .split('\n')
    .map((e) => e.trim())
  lines = labelLines(lines)
  lines = compileLabelToAddress(lines, pc)
  lines = lines.map((e) => assembleLine(e[1]))

  return lines.reduce((acc, arr) => [...acc, ...arr], [])
}
