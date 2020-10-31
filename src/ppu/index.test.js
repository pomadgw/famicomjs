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

    it('should set vertical blank to 1 at cycle 1, scanline 241', () => {
      ppu.cycle = 1
      ppu.scanline = 241
      ppu.clock()

      expect(ppu.statusReg.verticalBlank).toBe(1)
    })

    it('should set vertical blank to 0 at cycle 1, scanline -1', () => {
      ppu.statusReg.verticalBlank = 1
      ppu.cycle = 1
      ppu.scanline = -1
      ppu.clock()

      expect(ppu.statusReg.verticalBlank).toBe(0)
    })

    it('should set nmi at cycle 1, scanline 241 if nmi control is set', () => {
      ppu.cycle = 1
      ppu.scanline = 241
      ppu.controlReg.enablenmi = 1
      ppu.clock()

      expect(ppu.nmi).toBe(true)

      ppu.cycle = 1
      ppu.scanline = 241
      ppu.controlReg.enablenmi = 0
      ppu.nmi = false
      ppu.clock()

      expect(ppu.nmi).toBe(false)
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

    it('should get correct data from table name (vertical mirror mode)', () => {
      ppu.cartridge.mirrorMode = 1
      ppu.tableName[0][0x0001] = 0x1f
      ppu.tableName[1][0x0001] = 0x0f

      expect(ppu.ppuRead(0x2001)).toBe(0x1f)
      expect(ppu.ppuRead(0x2801)).toBe(0x1f)

      expect(ppu.ppuRead(0x2401)).toBe(0x0f)
      expect(ppu.ppuRead(0x2c01)).toBe(0x0f)
    })

    it('should get correct data from table name (horizontal mirror mode)', () => {
      ppu.cartridge.mirrorMode = 0
      ppu.tableName[0][0x0001] = 0x1f
      ppu.tableName[1][0x0001] = 0x0f

      expect(ppu.ppuRead(0x2001)).toBe(0x1f)
      expect(ppu.ppuRead(0x2401)).toBe(0x1f)

      expect(ppu.ppuRead(0x2801)).toBe(0x0f)
      expect(ppu.ppuRead(0x2c01)).toBe(0x0f)
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

    it('should set correct data to table name (vertical mirror mode)', () => {
      ppu.cartridge.mirrorMode = 1
      ppu.ppuWrite(0x2001, 0x01)
      ppu.ppuWrite(0x2401, 0x03)

      expect(ppu.ppuRead(0x2001)).toBe(0x01)
      expect(ppu.ppuRead(0x2801)).toBe(0x01)

      expect(ppu.tableName[1][0x0001]).toBe(0x03)
      expect(ppu.ppuRead(0x2c01)).toBe(0x03)
    })

    it('should set correct data to table name (horizontal mirror mode)', () => {
      ppu.cartridge.mirrorMode = 0
      ppu.ppuWrite(0x2001, 0x01)
      ppu.ppuWrite(0x2801, 0x03)

      expect(ppu.ppuRead(0x2001)).toBe(0x01)
      expect(ppu.ppuRead(0x2401)).toBe(0x01)

      expect(ppu.ppuRead(0x2801)).toBe(0x03)
      expect(ppu.ppuRead(0x2c01)).toBe(0x03)
    })
  })

  describe('#cpuRead', () => {
    it('should be able to read from ppu (with delay)', () => {
      const oldFn = ppu.ppuRead
      ppu.ppuRead = jest.fn(() => 0x10)

      ppu.cpuWrite(0x0006, 0x11)
      ppu.cpuWrite(0x0006, 0x10)

      // the fetched data from ppu is buffered
      let data = ppu.cpuRead(0x0007)
      expect(data).toBe(0)
      expect(ppu.ppuRead).toHaveBeenCalledWith(0x1110)
      expect(ppu.vramAddress.value).toBe(0x1111)

      data = ppu.cpuRead(0x0007)
      expect(data).toBe(0x10)
      ppu.ppuRead = oldFn
    })

    it('should be able to read palette from ppu immediately', () => {
      ppu.ppuRead = jest.fn(() => 0x10)
      ppu.cpuWrite(0x0006, 0x3f)
      ppu.cpuWrite(0x0006, 0x00)
      const data = ppu.cpuRead(0x0007)

      expect(data).not.toBe(0)
      expect(data).toBe(0x10)
    })

    it('should be able to read status', () => {
      const data = 0xf4
      const expected = data & 0xe0
      ppu.statusReg.value = data
      ppu.addressLatch = 1

      const fetched = ppu.cpuRead(0x0002)
      expect(fetched & 0xe0).toBe(expected)
      expect(ppu.statusReg.verticalBlank).toBe(0)
      expect(ppu.addressLatch).toBe(0)
    })
  })

  describe('#cpuWrite', () => {
    describe('control register', () => {
      it('should be able to write to control register', () => {
        ppu.cpuWrite(0x0000, 0x10)
        expect(ppu.controlReg.value).toBe(0x10)
      })

      it('should be able to set nametables', () => {
        ppu.cpuWrite(0x0000, 0x03)
        expect(ppu.tramAddress.nametableX).toBe(0x1)
        expect(ppu.tramAddress.nametableY).toBe(0x1)
      })
    })

    it('should be able to write to mask register', () => {
      ppu.cpuWrite(0x0001, 0x10)
      expect(ppu.maskReg.value).toBe(0x10)
    })

    it('should be able to write to status register', () => {
      ppu.cpuWrite(0x0002, 0x10)
      expect(ppu.statusReg.value).toBe(0x10)
    })

    it('should be able to write to ppu (increment mode = 0)', () => {
      jest.spyOn(ppu, 'ppuWrite')
      ppu.cpuWrite(0x0006, 0x11)
      ppu.cpuWrite(0x0006, 0x10)
      expect(ppu.tramAddress.value).toBe(0x1110)

      ppu.cpuWrite(0x0007, 0x1f)
      expect(ppu.ppuWrite).toHaveBeenCalledWith(0x1110, 0x1f)
      expect(ppu.vramAddress.value).toBe(0x1111)
    })

    it('should be able to write to ppu (increment mode = 1)', () => {
      jest.spyOn(ppu, 'ppuWrite')
      ppu.controlReg.incrementMode = 1
      ppu.cpuWrite(0x0006, 0x11)
      ppu.cpuWrite(0x0006, 0x10)
      expect(ppu.vramAddress.value).toBe(0x1110)

      ppu.cpuWrite(0x0007, 0x1f)
      expect(ppu.ppuWrite).toHaveBeenCalledWith(0x1110, 0x1f)
      expect(ppu.vramAddress.value).toBe(0x1110 + 0x20)
    })
  })
})
