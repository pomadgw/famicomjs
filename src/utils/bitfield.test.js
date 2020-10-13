import bitfield from './bitfield'

describe('bitfield', () => {
  it('should be able to change a value', () => {
    const field = bitfield([], new Uint8Array([0]))
    expect(field.value).toBe(0)

    field.value = 10
    expect(field.value).toBe(10)
  })

  it('should unmatched size', () => {
    expect(() =>
      bitfield(
        [
          ['dummy', 5],
          ['dummy2', 4]
        ],
        new Uint8Array([0])
      )
    ).toThrowError('Expected max 8 bits, got 9')
  })

  it('should be able to change a bitfield', () => {
    const field = bitfield(
      [
        ['data', 4],
        ['data2', 4],
        ['data3', 5],
        ['data4', 3]
      ],
      new Uint16Array([0])
    )
    expect(field.data).toBe(0)

    field.data = 0x07
    field.data2 = 0x01
    field.data3 = 0x1d
    field.data4 = 0x03
    expect(field.data).toBe(0x07)
    expect(field.data2).toBe(0x01)
    expect(field.data3).toBe(0x1d)
    expect(field.data4).toBe(0x03)
    expect(field.value).toBe((0x03 << 13) | (0x1d << 8) | (0x01 << 4) | 0x07)

    field.data4 = 0x00
    expect(field.data4).toBe(0x00)
  })
})
