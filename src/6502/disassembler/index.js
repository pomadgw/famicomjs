import opcodes from '../instructions'

function twoUint8ToUint16(low, high) {
  return (high << 8) | low
}

function toHex(number, padding = 2) {
  return `$${number.toString(16).toUpperCase().padStart(padding, '0')}`
}

export default function disassemble(codes = []) {
  const argParams = {
    ABS: {
      length: 2,
      stringify: (name, params) =>
        `${name} ${toHex(twoUint8ToUint16(...params), 4)}`
    },
    ABX: {
      length: 2,
      stringify: (name, params) =>
        `${name} ${toHex(twoUint8ToUint16(...params), 4)},X`
    },
    ABY: {
      length: 2,
      stringify: (name, params) =>
        `${name} ${toHex(twoUint8ToUint16(...params), 4)},Y`
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
      stringify: (name, params) => `${name} (${toHex(params[0])},X)`
    },
    IZY: {
      length: 1,
      stringify: (name, params) => `${name} (${toHex(params[0])}),Y`
    },
    REL: {
      length: 1,
      stringify: (name, params) => `${name} ${toHex(params[0])}`
    },
    ZP0: {
      length: 1,
      stringify: (name, params) => `${name} ${toHex(params[0])}`
    },
    ZPX: {
      length: 1,
      stringify: (name, params) => `${name} ${toHex(params[0])},X`
    },
    ZPY: {
      length: 1,
      stringify: (name, params) => `${name} ${toHex(params[0])},Y`
    }
  }

  const result = []
  const copyOfCode = [...codes]

  while (copyOfCode.length > 0) {
    const opcode = copyOfCode.shift()
    const { addressingName, name } = opcodes[opcode]
    const params = []

    for (let i = 0; i < argParams[addressingName].length; i += 1) {
      params.push(copyOfCode.shift())
    }

    result.push(argParams[addressingName].stringify(name, params))
  }

  return result
}
