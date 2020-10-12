import PPU from '.'

const createDummyCartridge = (defaultValue = null) => ({
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

  describe('when it clocks', () => {
    it('should increase a cycle', () => {
      ppu.cycle = 0
      ppu.clock()

      expect(ppu.cycle).toBe(1)
    })

    it('should update the screen', () => {
      jest.spyOn(ppu.screen, 'setColor')

      ppu.cycle = 0
      ppu.clock()

      expect(ppu.screen.setColor).toHaveBeenCalled()
      expect(ppu.screen.setColor.mock.calls[0].slice(0, 2)).toEqual([-1, 0])
    })

    it('should reset cycle and increment scanline when reaching cycle 341', () => {
      ppu.cycle = 341
      ppu.scanline = 0
      ppu.clock()

      expect(ppu.cycle).toBe(0)
      expect(ppu.scanline).toBe(1)
    })

    it('should reset scanline and set fram complete when reaching scanline 261', () => {
      ppu.cycle = 341
      ppu.scanline = 261
      ppu.clock()

      expect(ppu.cycle).toBe(0)
      expect(ppu.scanline).toBe(-1)
      expect(ppu.isFrameComplete).toBe(true)
    })
  })

  describe('#getPatternTable', () => {
    it('should set color', () => {
      ppu.insertCartridge(createDummyCartridge(1))

      jest.spyOn(ppu.screenPatternTable[0], 'setColor')
      ppu.getPatternTable(0)
      expect(ppu.screenPatternTable[0].setColor).toHaveBeenCalledTimes(
        16 * 16 * 8 * 8
      )
    })
  })

  describe('#ppuRead', () => {
    it('should get correct pattern', () => {
      const id = 0x01
      const offset = 0x12
      const address = (id << 12) | offset
      ppu.tablePattern[id][offset] = 0xff

      expect(ppu.ppuRead(address)).toBe(0xff)
    })

    it('should get correct palette', () => {
      ppu.tablePalette[0x00] = 0xff
      ppu.tablePalette[0x04] = 0xfd
      ppu.tablePalette[0x08] = 0xfe
      ppu.tablePalette[0x0c] = 0xf0

      expect(ppu.ppuRead(0x3f00)).toBe(0xff)
      expect(ppu.ppuRead(0x3f10)).toBe(0xff)
      expect(ppu.ppuRead(0x3f14)).toBe(0xfd)
      expect(ppu.ppuRead(0x3f18)).toBe(0xfe)
      expect(ppu.ppuRead(0x3f1c)).toBe(0xf0)
    })
  })

  describe('#ppuWrite', () => {
    it('should get correct pattern', () => {
      const id = 0x01
      const offset = 0x12
      const address = (id << 12) | offset
      ppu.ppuWrite(address, 0xff)

      expect(ppu.ppuRead(address)).toBe(0xff)
    })

    it('should set correct palette', () => {
      ppu.ppuWrite(0x3f00, 0xff)
      ppu.ppuWrite(0x3f04, 0xfd)
      ppu.ppuWrite(0x3f08, 0xfe)
      ppu.ppuWrite(0x3f0c, 0xf0)

      expect(ppu.ppuRead(0x3f00)).toBe(0xff)
      expect(ppu.ppuRead(0x3f10)).toBe(0xff)
      expect(ppu.ppuRead(0x3f14)).toBe(0xfd)
      expect(ppu.ppuRead(0x3f18)).toBe(0xfe)
      expect(ppu.ppuRead(0x3f1c)).toBe(0xf0)
    })
  })
})
