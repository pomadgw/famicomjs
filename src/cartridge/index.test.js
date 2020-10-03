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
    const buffer = new ArrayBuffer(16)
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
      1, // chr rom chunk
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
  })
})
