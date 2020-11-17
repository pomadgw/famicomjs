import Cartridge from '.'

// assemblyscript-specific method
Uint8Array.wrap = function wrap(arrayBuffer) {
  return new Uint8Array(arrayBuffer)
}

function generateCart() {
  const buffer = new ArrayBuffer(16 + 1 * 16384 + 1 * 8192)
  const view = new Uint8Array(buffer)
  const mapper1 = 0x0
  const mapper2 = 0x0
  view.set([
    // header
    0x4e,
    0x45,
    0x53,
    0x1a,
    1,
    1,
    mapper1,
    mapper2,
    12,
    0,
    1,
    0,
    0,
    0,
    0,
    0
  ])

  view.set([0xfe], 0x11)
  view.set([0xfd], 16 + 16384 + 1)

  const cart = new Cartridge(view)
  cart.parse()
  return { cart, view }
}

describe('Cartridge', () => {
  it('should be able to parse NES header', async () => {
    const buffer = new ArrayBuffer(16 + 1 * 16384 + 2 * 8192)
    const view = new Uint8Array(buffer)
    const mapper1 = 0x10
    const mapper2 = 0x0
    view.set([
      // header
      0x4e,
      0x45,
      0x53,
      0x1a,
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

    const cart = new Cartridge(buffer)
    cart.parse()

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
      0x4e,
      0x45,
      0x53,
      0x1a,
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

    const cart = new Cartridge(buffer)
    cart.parse()

    expect(cart.prgMemory[1]).toBe(0)
  })

  it('should be able to read prg data', async () => {
    const { cart } = generateCart()

    expect(cart.cpuRead(0x8001).value).toBe(0xfe)
    expect(cart.cpuRead(0x8001).error).toBeFalsy()
    expect(cart.cpuRead(0x7fff).error).toBeTruthy()
  })

  it('should be able to write prg data', async () => {
    const { cart } = generateCart()

    expect(cart.cpuWrite(0x8001, 0x01).error).toBe(false)
    expect(cart.prgMemory[0x01]).toBe(0x01)
    expect(cart.cpuWrite(0x7fff).error).toBeTruthy()
  })

  it('should be able to read chr data', async () => {
    const { cart } = generateCart()

    expect(cart.ppuRead(0x0001).value).toBe(0xfd)
    expect(cart.ppuRead(0x0001).error).toBe(false)
    expect(cart.ppuRead(0x7fff).error).toBe(true)
  })

  it('should be able to write chr data', async () => {
    const { cart } = generateCart()
    expect(cart.ppuWrite(0x7fff).error).toBe(true)

    const oldFn = cart.mapper.ppuMapWrite
    // mock ppuMapWrite
    cart.mapper.ppuMapWrite = () => ({ status: true, mappedAddress: 0x01 })

    expect(cart.ppuWrite(0x0001, 0x01).error).toBe(false)
    expect(cart.chrMemory[0x01]).toBe(0x01)
    cart.mapper.ppuMapWrite = oldFn
  })
})
