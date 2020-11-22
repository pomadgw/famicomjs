import opcodes from '../instructions'
import toHexOriginal from '../../utils/tohex'

function twoUint8ToUint16(low, high) {
  return (high << 8) | low
}

function toHex(number, length = 2) {
  return toHexOriginal(number, { length, withPrefix: true })
}

function getContent(name, params, length, ram, registers, offsetReg, mode) {
  const address = length === 1 ? params[0] : twoUint8ToUint16(...params)
  const offset = offsetReg ? registers[offsetReg] : 0
  let content = ''

  if (['LDA', 'LDX', 'LDY', 'STA', 'STX', 'STY'].includes(name)) {
    let targetAddress = (address + offset) & 0xffff
    content = ram[targetAddress]

    if (mode === 'izx') {
      targetAddress =
        (ram[(address + offset) & 0xff] << 8) |
        ram[(address + offset + 1) & 0xff]

      const realContent = ram[targetAddress]

      content = ` @ ${toHexOriginal(
        content & 0xff
      )} = ${toHexOriginal(targetAddress, { length: 4 })} = ${toHexOriginal(
        realContent
      )}`
    } else if (mode === 'izy') {
      const targetAddressLo = ram[address + 0]
      const targetAddressHi = ram[(address + 1) & 0xff]
      targetAddress = (targetAddressHi << 8) | targetAddressLo
      const offsetedTargetAddress = (targetAddress + offset) & 0xffff

      const realContent = ram[offsetedTargetAddress]
      content = ` = ${toHexOriginal(targetAddress, {
        length: 4
      })} @ ${toHexOriginal(offsetedTargetAddress, {
        length: 4
      })} = ${toHexOriginal(realContent)}`
    } else {
      content = ` = ${toHexOriginal(content)}`
    }
  }

  return content
}

export const argParamsGenerator = (
  binaryStart,
  nintendulatorFormat = false,
  ram = [],
  registers = {}
) => ({
  ABS: {
    length: 2,
    stringify: (name, params) => {
      let result = `${name} ${toHex(twoUint8ToUint16(...params), 4)}`
      if (nintendulatorFormat) {
        result += `${getContent(name, params, 2, ram, registers)}`
      }

      return result
    }
  },
  ABX: {
    length: 2,
    stringify: (name, params) => {
      let result = `${name} ${toHex(twoUint8ToUint16(...params), 4)},X`

      if (nintendulatorFormat) {
        result += `${getContent(name, params, 2, ram, registers, 'X')}`
      }

      return result
    }
  },
  ABY: {
    length: 2,
    stringify: (name, params) => {
      let result = `${name} ${toHex(twoUint8ToUint16(...params), 4)},Y`

      if (nintendulatorFormat) {
        result += `${getContent(name, params, 2, ram, registers, 'Y')}`
      }

      return result
    }
  },
  IMM: {
    length: 1,
    stringify: (name, params) => `${name} #${toHex(params[0])}`
  },
  IMP: {
    length: 0,
    stringify: (name, params) => {
      if (name === 'ASL') return 'ASL A'
      return name
    }
  },
  IND: {
    length: 2,
    stringify: (name, params) =>
      `${name} (${toHex(twoUint8ToUint16(...params), 4)})`
  },
  IZX: {
    length: 1,
    stringify: (name, params) => {
      let result = `${name} (${toHex(params[0])},X)`
      if (nintendulatorFormat) {
        result += `${getContent(name, params, 1, ram, registers, 'X', 'izx')}`
      }

      return result
    }
  },
  IZY: {
    length: 1,
    stringify: (name, params) => {
      let result = `${name} (${toHex(params[0])}),Y`
      if (nintendulatorFormat) {
        result += `${getContent(name, params, 1, ram, registers, 'Y', 'izy')}`
      }

      return result
    }
  },
  REL: {
    length: 1,
    stringify: (name, params, line) => {
      let result = `${name}`

      if (binaryStart) {
        const offset = new Int8Array([params[0]])[0]
        if (nintendulatorFormat) result += ` ${toHex(line + offset + 2, 4)}`
        else
          result += ` ${toHex(params[0])} // [${toHex(line + offset + 2, 4)}]`
      } else {
        result += ` ${toHex(params[0])}`
      }

      return result
    }
  },
  ZP0: {
    length: 1,
    stringify: (name, params) => {
      let result = `${name} ${toHex(params[0])}`
      if (nintendulatorFormat) {
        result += `${getContent(name, params, 1, ram, registers)}`
      }

      return result
    }
  },
  ZPX: {
    length: 1,
    stringify: (name, params) => {
      let result = `${name} ${toHex(params[0])},X`
      if (nintendulatorFormat) {
        result += `${getContent(name, params, 1, ram, registers, 'X')}`
      }

      return result
    }
  },
  ZPY: {
    length: 1,
    stringify: (name, params) => {
      let result = `${name} ${toHex(params[0])},Y`
      if (nintendulatorFormat) {
        result += `${getContent(name, params, 1, ram, registers, 'Y')}`
      }

      return result
    }
  }
})

export default function disassemble(
  codes = [],
  { binaryStart, nintendulatorFormat, ram, registers } = {}
) {
  const argParams = argParamsGenerator(
    binaryStart,
    nintendulatorFormat,
    ram,
    registers
  )

  const result = {}
  const copyOfCode = []

  // manually copy the code

  for (let i = 0; i < codes.length; i++) {
    copyOfCode.push(codes[i])
  }

  let line = binaryStart ?? 0

  while (copyOfCode.length > 0) {
    const instructionLine = line

    const opcode = copyOfCode.shift()
    line += 1

    const { addressingName, name } = opcodes[opcode]
    const params = []

    for (let i = 0; i < argParams[addressingName].length; i += 1) {
      params.push(copyOfCode.shift())
      line += 1
    }

    try {
      result[toHex(instructionLine, 4)] = argParams[addressingName].stringify(
        name,
        params,
        instructionLine
      )
    } catch (e) {
      result[toHex(instructionLine, 4)] = `${name} ??`
    }
  }

  return result
}
