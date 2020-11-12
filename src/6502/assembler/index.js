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

function assembleLine({ opcode, params, label, startBinary }) {
  let addressingMode = params?.mode ?? 'IMP'

  if (branchingOperators.includes(opcode.toLowerCase())) {
    addressingMode = 'REL'
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
    result = [Number(opcodeNumber[0]), ...(params?.value ? params.value : [])]

  return {
    result,
    length: result.length,
    label,
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
  let i = 0
  let pc = null
  const reset = { address: 0xfffc }
  const nmi = { address: 0xfffa }
  const irq = { address: 0xfffe }

  const slicePoints = []

  while (i < parseTree.length) {
    if (parseTree[i].data) {
      data.push(parseTree[i])
      parseTree.splice(i, 1)
    } else if (parseTree[i].reset) {
      reset.data = parseTree[i].reset
      parseTree.splice(i, 1)
    } else if (parseTree[i].nmi) {
      nmi.data = parseTree[i].nmi
      parseTree.splice(i, 1)
    } else if (parseTree[i].irq) {
      irq.data = parseTree[i].irq
      parseTree.splice(i, 1)
    } else if (parseTree[i].pc) {
      pc = word(...parseTree[i].pc)
      parseTree.splice(i, 1)
    } else if (parseTree[i].label) {
      labels.push({ ...parseTree[i], offset: i })
      parseTree.splice(i, 1)
    } else {
      if (pc !== null) {
        parseTree[i].startBinary = pc
        slicePoints.push(i)
        pc = null
      }

      if (labels.length > 0) {
        parseTree[i].label = labels.pop()
      }

      i++
    }
  }

  const newTree = parseTree.map(assembleLine)

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
      return newLength
    }, 0)

    tree
      .filter((e) => e.labelTarget)
      .forEach((e) => {
        const target = tree.find((en) => {
          return en.label?.label === e.labelTarget
        })

        if (target) {
          let offset = target.totalLength - e.totalLength - target.length
          if (offset < 0) offset -= 1

          e.result.push(offset & 0xff)
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
