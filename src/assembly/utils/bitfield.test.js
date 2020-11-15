import bitfield from './bitfield'

describe('bitfield', () => {
  it('should be able to change a value', () => {
    const field = new bitfield([], new Uint8Array([0]))
    expect(field.value).toBe(0)

    field.value = 10
    expect(field.value).toBe(10)
  })

  it('should be able to change a bitfield', () => {
    const field = new bitfield(
      [
        {
          name: 'data',
          size: 4
        },
        {
          name: 'data2',
          size: 4
        },
        {
          name: 'data3',
          size: 5
        },
        {
          name: 'data4',
          size: 5
        }
      ],
      0
    )
    expect(field.get('data')).toBe(0)

    field.set('data', 0x07)
    field.set('data2', 0x00)
    field.set('data3', 0x1d)
    field.set('data4', 0x03)
    expect(field.get('data')).toBe(0x07)
    expect(field.get('data2')).toBe(0x00)
    expect(field.get('data3')).toBe(0x1d)
    expect(field.get('data4')).toBe(0x03)
    expect(field.value).toBe((0x03 << 13) | (0x1d << 8) | (0x00 << 4) | 0x07)

    field.set('data4', 0x00)
    expect(field.get('data4')).toBe(0x00)

    const loopy = new bitfield(
      [
        ['coarseX', 5],
        ['coarseY', 5],
        ['nametableX', 1],
        ['nametableY', 1],
        ['fineY', 3],
        ['unused', 1],
        { name: 'coarseX', size: 5 },
        { name: 'coarseY', size: 5 },
        { name: 'nametableX', size: 1 },
        { name: 'nametableY', size: 1 },
        { name: 'fineY', size: 3 },
        { name: 'unused', size: 1 }
      ],
      0
    )

    loopy.value = 0
    loopy.set('coarseX', 0x17 >> 3)
    loopy.set('fineY', 0x17 >> 3)
    loopy.set('fineY', 7)
    expect(loopy.get('fineY')).toBe(7)
  })

  it('should be able to change a bitfield as a boolean', () => {
    const field = new bitfield(
      [
        {
          name: 'data',
          size: 1
        },
        {
          name: 'data2',
          size: 4
        }
      ],
      0
    )

    expect(field.getAsBoolean('data')).toBe(false)
    field.setAsBoolean('data', true)
    expect(field.getAsBoolean('data')).toBe(true)
    expect(field.get('data')).toBe(1)
  })
})
