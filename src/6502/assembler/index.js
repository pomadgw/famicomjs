import opcodes from '../instructions'
import parser from './parser'

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

function assembleLine({ opcode, params, label, startBinary }, variables = {}) {
  let addressingMode = params?.mode ?? 'IMP'
  let defaultValue = []

  if (branchingOperators.includes(opcode.toLowerCase())) {
    addressingMode = 'REL'
  }

  if (!params?.mode && ['jmp', 'jsr'].includes(opcode.toLowerCase())) {
    addressingMode = 'ABS'
  }

  if (params?.label && variables[params.label]) {
    addressingMode = params?.mode ?? variables[params.label].mode
    defaultValue = variables[params.label].value
  }

  if (params?.offsetRegister) {
    addressingMode = `${addressingMode.slice(0, 2)}${params.offsetRegister}`
  }

  const opcodeNumber = Object.entries(opcodes).find(
    ([, value]) =>
      value.name.toLowerCase() === opcode.toLowerCase() &&
      value.addressingName === addressingMode
  )

  let result

  if (addressingMode === 'IMP') result = [Number(opcodeNumber[0])]
  else
    result = [
      Number(opcodeNumber[0]),
      ...(params?.value ? params.value : defaultValue)
    ]

  let length = result.length
  if (!params?.mode && ['jmp', 'jsr'].includes(opcode.toLowerCase())) {
    length += 2
  } else if (branchingOperators.includes(opcode.toLowerCase())) {
    length += 1
  }

  return {
    result,
    length,
    label,
    opcode,
    addressingMode,
    ...(params?.label ? { labelTarget: params.label } : {}),
    ...(startBinary ? { startBinary } : {})
  }
}

function word(low, high) {
  return (high << 8) | low
}

export default function compile(string) {
  const parseTree = parser.parse(string.trim().replace(/(;|\/\/).+/g, ''))
  const labels = []
  const data = []
  const variables = {}
  let i = 0
  let pc = null
  let currPc = null
  const reset = { address: 0xfffc }
  const nmi = { address: 0xfffa }
  const irq = { address: 0xfffe }

  const slicePoints = []

  while (i < parseTree.length) {
    const currData = parseTree[i]
    if (currData.data) {
      data.push(currData)
      parseTree.splice(i, 1)
    } else if (currData.varName) {
      variables[currData.varName] = currData.value
      parseTree.splice(i, 1)
    } else if (currData.reset) {
      reset.data = currData.reset
      parseTree.splice(i, 1)
    } else if (currData.nmi) {
      nmi.data = currData.nmi
      parseTree.splice(i, 1)
    } else if (currData.irq) {
      irq.data = currData.irq
      parseTree.splice(i, 1)
    } else if (currData.pc) {
      pc = word(...currData.pc)
      currPc = pc
      parseTree.splice(i, 1)
    } else if (currData.label) {
      labels.push({ ...currData, offset: i, pc: currPc ?? 0 })
      parseTree.splice(i, 1)
    } else {
      if (pc !== null) {
        currData.startBinary = pc
        slicePoints.push(i)
        pc = null
      }

      if (labels.length > 0) {
        currData.label = labels.pop()
      }

      i++
    }
  }

  const newTree = parseTree.map((e) => assembleLine(e, variables))

  const slicedArray = []

  if (slicePoints.length === 0) slicePoints.push(0)

  slicePoints.forEach((point, idx, arr) => {
    const nextPoint = arr?.[idx + 1] ?? newTree.length
    slicedArray.push(newTree.slice(point, nextPoint))
  })

  const preprocess = (tree) => {
    tree.reduce((acc, length, idx, arr) => {
      const newLength = acc + arr[idx].length
      arr[idx].totalLength = newLength
      arr[idx].pos = acc
      return newLength
    }, 0)

    tree
      .filter((e) => e.labelTarget)
      .forEach((e) => {
        const target = tree.find((en) => {
          return en.label?.label === e.labelTarget
        })

        if (target) {
          if (e.addressingMode === 'ABS') {
            const targetAddress = target.label.pc + target.pos
            const lo = targetAddress & 0xff
            const hi = (targetAddress >> 8) & 0xff
            e.result.push(lo)
            e.result.push(hi)
          } else {
            const offset = target.totalLength - e.totalLength - target.length

            e.result.push(offset & 0xff)
          }
        }
      })
  }

  slicedArray.map(preprocess)

  const image = [...Array(0x10000).keys()].map(() => 0)

  for (let i = 0; i < 0x10000; i++) {
    image[i] = image[i] ?? 0
  }

  slicedArray.forEach((array) => {
    const startBinary = array[0].startBinary ?? 0
    const result = array
      .map((e) => e.result)
      .reduce((acc, arr) => [...acc, ...arr], [])
    image.splice(startBinary, result.length, ...result)
  })

  data.forEach((d) => {
    image.splice(d.address, d.data.length, ...d.data)
  })
  ;[reset, nmi, irq].forEach((interrupt) => {
    if (interrupt.data) image.splice(interrupt.address, 2, ...interrupt.data)
  })

  return image
}
