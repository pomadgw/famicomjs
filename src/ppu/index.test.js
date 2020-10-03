import PPU from '.'

const createDummyCartridge = (defaultValue = false) => ({
  cpuRead: jest.fn(() => defaultValue),
  cpuWrite: jest.fn(() => defaultValue),
  ppuRead: jest.fn(() => defaultValue),
  ppuWrite: jest.fn(() => defaultValue)
})

describe('PPU', () => {
  let ppu

  beforeEach(() => {
    ppu = new PPU()
    ppu.insertCartridge(createDummyCartridge())
  })

  it('should always check if cartridge vetoed it', () => {
    ppu.ppuRead(1)
    expect(ppu.cartridge.ppuRead).toHaveBeenCalled()
    ppu.ppuWrite(1, 1)
    expect(ppu.cartridge.ppuWrite).toHaveBeenCalled()
  })
})
