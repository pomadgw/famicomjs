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
})
