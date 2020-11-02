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
    field.data2 = 0x00
    field.data3 = 0x1d
    field.data4 = 0x03
    expect(field.data).toBe(0x07)
    expect(field.data2).toBe(0x00)
    expect(field.data3).toBe(0x1d)
    expect(field.data4).toBe(0x03)
    expect(field.value).toBe((0x03 << 13) | (0x1d << 8) | (0x00 << 4) | 0x07)

    field.data4 = 0x00
    expect(field.data4).toBe(0x00)

    const loopy = bitfield(
      [
        ['coarseX', 5],
        ['coarseY', 5],
        ['nametableX', 1],
        ['nametableY', 1],
        ['fineY', 3],
        ['unused', 1]
      ],
      new Uint16Array([0])
    )

    loopy.value = 0
    loopy.coarseX = 0x17 >> 3
    loopy.fineY = 7
    loopy.coarseY = 0x17 >> 3
    expect(loopy.fineY).toBe(7)
  })

  it('should be able to change a bitfield as a boolean', () => {
    const field = bitfield(
      [
        ['data', 1],
        ['data2', 4]
      ],
      new Uint8Array([0])
    )

    expect(field.bData).toBe(false)
    field.bData = true
    expect(field.bData).toBe(true)
    expect(field.data).toBe(1)
  })
})
