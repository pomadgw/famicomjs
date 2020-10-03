import Cartridge from '.'

function mockNES({
  name = 'file.nes',
  type = 'application/octet-stream',
  lastModified = new Date(),
  data = []
}) {
  const blob = new Blob([data], { type })

  blob.lastModifiedDate = lastModified

  return new File([blob], name)
}

describe('Cartridge', () => {
  it('should be able to parse NES header', async () => {
    const buffer = new ArrayBuffer(16 + 1 * 16384 + 2 * 8192)
    const view = new Uint8Array(buffer)
    const mapper1 = 0x10
    const mapper2 = 0x0
    view.set([
      // header
      105,
      78,
      69,
      83,
      1, // prg rom chunk
      2, // chr rom chunk
      mapper1, // mapper 1
      mapper2, // mapper 2
      12, // prg ram size
      0, // tv system 1
      1, // tv system 1
      0,
      0,
      0,
      0,
      0
    ])

    const file = mockNES({
      data: buffer
    })

    const cart = new Cartridge()
    await cart.parse(file)

    const expectedMapperId = ((mapper2 >> 4) << 4) | (mapper1 >> 4)

    expect(cart.mapperId).toBe(expectedMapperId)
    expect(cart.prgBankNumber).toBe(1)
    expect(cart.chrBankNumber).toBe(2)
    expect(cart.prgMemory.length).toBe(16384)
    expect(cart.chrMemory.length).toBe(2 * 8192)
  })

  it('should skip training header', async () => {
    const buffer = new ArrayBuffer(16 + 512 + 1 * 16384 + 2 * 8192)
    const view = new Uint8Array(buffer)
    const mapper1 = 0x04
    const mapper2 = 0x0
    view.set([
      // header
      105,
      78,
      69,
      83,
      1, // prg rom chunk
      2, // chr rom chunk
      mapper1, // mapper 1
      mapper2, // mapper 2
      12, // prg ram size
      0, // tv system 1
      1, // tv system 1
      0,
      0,
      0,
      0,
      0,
      ...Array(256).keys(),
      ...Array(256).keys()
    ])

    const file = mockNES({
      data: buffer
    })

    const cart = new Cartridge()
    await cart.parse(file)

    expect(cart.prgMemory[1]).toBe(0)
  })
})
