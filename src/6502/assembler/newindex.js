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

function assembleLine({ opcode, params, label }) {
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
    ...(params?.label ? { labelTarget: params.label } : {})
  }
}

function word(low, high) {
  return (high << 8) | low
}

export default function compile(string) {
  const parseTree = parser.parse(string.trim())
  const labels = []
  const data = []
  let i = 0
  let pc = 0

  while (i < parseTree.length) {
    if (parseTree[i].data) {
      data.push(parseTree[i])
      parseTree.splice(i, 1)
    } else if (parseTree[i].pc) {
      pc = word(...parseTree[i].pc)
      parseTree.splice(i, 1)
    } else if (parseTree[i].label) {
      labels.push({ ...parseTree[i], offset: i })
      parseTree.splice(i, 1)
    } else {
      if (labels.length > 0) {
        parseTree[i].label = labels.pop()
      }
      i++
    }
  }

  const newTree = parseTree.map(assembleLine)
  newTree.reduce((acc, length, idx, arr) => {
    const newLength = acc + arr[idx].length
    arr[idx].totalLength = newLength
    return newLength
  }, 0)

  newTree
    .filter((e) => e.labelTarget)
    .forEach((e) => {
      const target = newTree.find((en) => {
        return en.label?.label === e.labelTarget
      })

      if (target) {
        let offset = target.totalLength - e.totalLength - target.length
        if (offset < 0) offset -= 1

        e.result.push(offset & 0xff)
      }
    })

  const result = newTree
    .map((e) => e.result)
    .reduce((acc, arr) => [...acc, ...arr], [])
  const offset = [...Array(pc).keys()].map(() => 0)

  const image = [...offset, ...result]
  image.length = 0x10000
  for (let i = 0; i < 0x10000; i++) {
    image[i] = image[i] ?? 0
  }

  data.forEach((d) => {
    image.splice(d.address, d.data.length, ...d.data)
  })

  return image
}
