export default function bitfield(structure, arrayedNumber) {
  const result = {}
  const totalSize = structure.map((e) => e[1]).reduce((a, b) => a + b, 0)

  if (totalSize > arrayedNumber.BYTES_PER_ELEMENT * 8) {
    throw new Error(
      `Expected max ${
        arrayedNumber.BYTES_PER_ELEMENT * 8
      } bits, got ${totalSize}`
    )
  }

  Object.defineProperty(result, 'value', {
    get() {
      return arrayedNumber[0]
    },
    set(value) {
      arrayedNumber[0] = value
    }
  })

  let pos = 0
  structure.forEach(([field, size]) => {
    const posStart = pos

    Object.defineProperty(result, field, {
      get() {
        return (arrayedNumber[0] >> posStart) & ((1 << size) - 1)
      },
      set(value) {
        const reset = ~(0xff << posStart)
        value = value & ((1 << size) - 1)
        value = value << posStart
        arrayedNumber[0] = (arrayedNumber[0] & reset) | value
      }
    })

    pos += size
  })

  return result
}
