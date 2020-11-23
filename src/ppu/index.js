import MIRROR_MODE from './mirror-mode'
import Screen from '../utils/screen'

export const palScreen = [
  { r: 84, g: 84, b: 84 },
  { r: 0, g: 30, b: 116 },
  { r: 8, g: 16, b: 144 },
  { r: 48, g: 0, b: 136 },
  { r: 68, g: 0, b: 100 },
  { r: 92, g: 0, b: 48 },
  { r: 84, g: 4, b: 0 },
  { r: 60, g: 24, b: 0 },
  { r: 32, g: 42, b: 0 },
  { r: 8, g: 58, b: 0 },
  { r: 0, g: 64, b: 0 },
  { r: 0, g: 60, b: 0 },
  { r: 0, g: 50, b: 60 },
  { r: 0, g: 0, b: 0 },
  { r: 0, g: 0, b: 0 },
  { r: 0, g: 0, b: 0 },

  { r: 152, g: 150, b: 152 },
  { r: 8, g: 76, b: 196 },
  { r: 48, g: 50, b: 236 },
  { r: 92, g: 30, b: 228 },
  { r: 136, g: 20, b: 176 },
  { r: 160, g: 20, b: 100 },
  { r: 152, g: 34, b: 32 },
  { r: 120, g: 60, b: 0 },
  { r: 84, g: 90, b: 0 },
  { r: 40, g: 114, b: 0 },
  { r: 8, g: 124, b: 0 },
  { r: 0, g: 118, b: 40 },
  { r: 0, g: 102, b: 120 },
  { r: 0, g: 0, b: 0 },
  { r: 0, g: 0, b: 0 },
  { r: 0, g: 0, b: 0 },

  { r: 236, g: 238, b: 236 },
  { r: 76, g: 154, b: 236 },
  { r: 120, g: 124, b: 236 },
  { r: 176, g: 98, b: 236 },
  { r: 228, g: 84, b: 236 },
  { r: 236, g: 88, b: 180 },
  { r: 236, g: 106, b: 100 },
  { r: 212, g: 136, b: 32 },
  { r: 160, g: 170, b: 0 },
  { r: 116, g: 196, b: 0 },
  { r: 76, g: 208, b: 32 },
  { r: 56, g: 204, b: 108 },
  { r: 56, g: 180, b: 204 },
  { r: 60, g: 60, b: 60 },
  { r: 0, g: 0, b: 0 },
  { r: 0, g: 0, b: 0 },

  { r: 236, g: 238, b: 236 },
  { r: 168, g: 204, b: 236 },
  { r: 188, g: 188, b: 236 },
  { r: 212, g: 178, b: 236 },
  { r: 236, g: 174, b: 236 },
  { r: 236, g: 174, b: 212 },
  { r: 236, g: 180, b: 176 },
  { r: 228, g: 196, b: 144 },
  { r: 204, g: 210, b: 120 },
  { r: 180, g: 222, b: 120 },
  { r: 168, g: 226, b: 144 },
  { r: 152, g: 226, b: 180 },
  { r: 160, g: 214, b: 228 },
  { r: 160, g: 162, b: 160 },
  { r: 0, g: 0, b: 0 },
  { r: 0, g: 0, b: 0 }
]

class OAM {
  constructor(x = 0, y = 0, id = 0, attrib = 0) {
    this.x = x
    this.y = y
    this.id = id
    this.attrib = attrib
  }

  get values() {
    const array = [this.y, this.id, this.attrib, this.x]

    return new Proxy(array, {
      get: (target, addr) => target[addr],
      set: (target, addr, value) => {
        target[addr] = value

        switch (addr) {
          case '0':
            this.y = value
            break
          case '1':
            this.id = value
            break
          case '2':
            this.attrib = value
            break
          case '3':
            this.x = value
            break
          default:
            break
        }

        return true
      }
    })
  }

  transfer(otherOAM) {
    this.x = otherOAM.x
    this.y = otherOAM.y
    this.id = otherOAM.id
    this.attrib = otherOAM.attrib
  }

  reset() {
    this.x = 0xff
    this.y = 0xff
    this.id = 0xff
    this.attrib = 0xff
  }
}

export const STATUS = {
  VERTICAL_BLANK: 1 << 7,
  SPRITE_ZERO_HIT: 1 << 6,
  SPRITE_OVERFLOW: 1 << 5
}

export const MASK = {
  GRAYSCALE: 1,
  RENDER_BG_LEFT: 1 << 1,
  RENDER_SPRITES_LEFT: 1 << 2,
  RENDER_BG: 1 << 3,
  RENDER_SPRITES: 1 << 4,
  ENHANCE_RED: 1 << 5,
  ENHANCE_GREEN: 1 << 6,
  ENHANCE_BLUE: 1 << 7
}

export const CONTROL = {
  NAMETABLE_X: 1,
  NAMETABLE_Y: 1 << 1,
  INCREMENT_MODE: 1 << 2,
  PATTERN_SPRITE: 1 << 3,
  PATTERN_BG: 1 << 4,
  SPRITE_SIZE: 1 << 5,
  SLAVE_MODE: 1 << 6, // unused
  ENABLENMI: 1 << 7
}

export const LOOPY_REG = {
  COARSE_X: {
    flags: 0b0000_0000_0001_1111,
    length: 5,
    posStart: 0
  },
  COARSE_Y: {
    flags: 0b0000_0011_1110_0000,
    length: 5,
    posStart: 5
  },
  NAMETABLE_X: {
    flags: 0b0000_0100_0000_0000,
    length: 1,
    posStart: 10
  },
  NAMETABLE_Y: {
    flags: 0b0000_1000_0000_0000,
    length: 1,
    posStart: 11
  },
  FINE_Y: {
    flags: 0b0111_0000_0000_0000,
    length: 3,
    posStart: 12
  }
}

export function setLoopy(target, value, { flags, length, posStart }) {
  target &= ~flags
  if (length === 1) {
    if (value === 1) target |= flags
  } else {
    target |= (value << posStart) & flags
  }

  return target
}

export function getLoopy(target, { flags, posStart }) {
  return (target & flags) >> posStart
}

export default class PPU {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    this.tableName = [new Uint8Array(1024), new Uint8Array(1024)]
    this.tablePattern = [new Uint8Array(4096), new Uint8Array(4096)]
    this.tablePalette = new Uint8Array(32)

    this.oam = [...Array(64).keys()].map(() => new OAM())
    this.spriteScanline = [...Array(8).keys()].map(() => new OAM())
    this.spriteCount = 0
    this.oamAddress = 0x0000

    this.bSpriteZeroHitPossible = false
    this.bSpriteZeroBeingRendered = false

    this.screen = new Screen(256, 240)
    // for debugging purposes
    this.screenTableName = [new Screen(256, 240), new Screen(256, 240)]
    this.screenPatternTable = [new Screen(128, 128), new Screen(128, 128)]

    this.isFrameComplete = false

    this.scanline = 0
    this.cycle = 0

    this.status = 0
    this.mask = 0
    this.control = 0

    this.addressLatch = 0x00
    this.ppuDataBuffer = 0x00
    this.ppuAddress = 0x0000

    this.vramAddress = 0
    this.tramAddress = 0

    this.fineX = 0

    this.nmi = false

    this.bgNextTile = {
      id: 0,
      attrib: 0,
      lsb: 0,
      msb: 0
    }

    const rootThis = this

    this.shifter = {
      bgPattern: {
        lo: 0,
        hi: 0
      },
      bgAttrib: {
        lo: 0,
        hi: 0
      },
      spritePatternLo: [0, 0, 0, 0, 0, 0, 0, 0],
      spritePatternHi: [0, 0, 0, 0, 0, 0, 0, 0],
      reset() {
        this.bgPattern = {
          lo: 0,
          hi: 0
        }

        this.bgAttrib = {
          lo: 0,
          hi: 0
        }
      },
      resetSpriteShifter() {
        for (let i = 0; i < 8; i++) {
          this.spritePatternLo[i] = 0
          this.spritePatternHi[i] = 0
        }
      },
      loadBgShifter() {
        this.bgPattern.lo =
          (this.bgPattern.lo & 0xff00) | rootThis.bgNextTile.lsb
        this.bgPattern.hi =
          (this.bgPattern.hi & 0xff00) | rootThis.bgNextTile.msb

        this.bgAttrib.lo =
          (this.bgAttrib.lo & 0xff00) |
          ((rootThis.bgNextTile.attrib & 0x01) > 0 ? 0xff : 0)
        this.bgAttrib.hi =
          (this.bgAttrib.hi & 0xff00) |
          ((rootThis.bgNextTile.attrib & 0x02) > 0 ? 0xff : 0)
      },
      updateShifter() {
        if ((rootThis.mask & MASK.RENDER_BG) > 0) {
          this.bgPattern.lo <<= 1
          this.bgPattern.hi <<= 1
          this.bgAttrib.lo <<= 1
          this.bgAttrib.hi <<= 1
        }

        if (
          (rootThis.mask & MASK.RENDER_SPRITES) > 0 &&
          rootThis.cycle >= 1 &&
          rootThis.cycle < 258
        ) {
          for (let i = 0; i < rootThis.spriteCount; i++) {
            if (rootThis.spriteScanline[i].x > 0) {
              rootThis.spriteScanline[i].x--
            } else {
              this.spritePatternLo[i] <<= 1
              this.spritePatternHi[i] <<= 1
            }
          }
        }
      },
      yieldPixel() {
        let bgPixel = 0
        let bgPalette = 0

        if ((rootThis.mask & MASK.RENDER_BG) > 0) {
          const bitmux = 0x8000 >> rootThis.fineX

          const [p0Pixel, p1Pixel] = [
            (this.bgPattern.lo & bitmux) > 0 ? 1 : 0,
            (this.bgPattern.hi & bitmux) > 0 ? 1 : 0
          ]

          const [bgPal0, bgPal1] = [
            (this.bgAttrib.lo & bitmux) > 0 ? 1 : 0,
            (this.bgAttrib.hi & bitmux) > 0 ? 1 : 0
          ]

          bgPixel = (p1Pixel << 1) | p0Pixel
          bgPalette = (bgPal1 << 1) | bgPal0
        }

        let fgPixel = 0
        let fgPalette = 0
        let fgPriority = false

        if ((rootThis.mask & MASK.RENDER_SPRITES) > 0) {
          rootThis.bSpriteZeroBeingRendered = false

          for (let i = 0; i < rootThis.spriteCount; i++) {
            if (rootThis.spriteScanline[i].x === 0) {
              const fgPixelLo = (this.spritePatternLo[i] & 0x80) > 0 ? 1 : 0
              const fgPixelHi = (this.spritePatternHi[i] & 0x80) > 0 ? 1 : 0
              fgPixel = (fgPixelHi << 1) | fgPixelLo
              fgPalette = (rootThis.spriteScanline[i].attrib & 0x03) + 0x04
              fgPriority = (rootThis.spriteScanline[i].attrib & 0x20) === 0

              if (fgPixel !== 0) {
                if (i === 0) rootThis.bSpriteZeroBeingRendered = true
                break
              }
            }
          }
        }

        let pixel = 0
        let palette = 0

        if (bgPixel === 0 && fgPixel === 0) {
          pixel = 0
          palette = 0
        } else if (bgPixel === 0 && fgPixel > 0) {
          pixel = fgPixel
          palette = fgPalette
        } else if (bgPixel >= 0 && fgPixel === 0) {
          pixel = bgPixel
          palette = bgPalette
        } else {
          if (fgPriority) {
            pixel = fgPixel
            palette = fgPalette
          } else {
            pixel = bgPixel
            palette = bgPalette
          }

          // Detect sprite zero hit
          if (
            rootThis.bSpriteZeroHitPossible &&
            rootThis.bSpriteZeroBeingRendered
          ) {
            if (
              (rootThis.mask & MASK.RENDER_BG) > 0 &&
              (rootThis.mask & MASK.RENDER_SPRITES) > 0
            ) {
              if (
                !(
                  (rootThis.mask & MASK.RENDER_BG_LEFT) > 0 ||
                  (rootThis.mask & MASK.RENDER_SPRITES_LEFT) > 0
                )
              ) {
                if (rootThis.cycle >= 9 && rootThis.cycle < 258) {
                  rootThis.status |= STATUS.SPRITE_ZERO_HIT
                }
              } else {
                if (rootThis.cycle >= 1 && rootThis.cycle < 258) {
                  rootThis.status |= STATUS.SPRITE_ZERO_HIT
                }
              }
            }
          }
        }

        return {
          pixel,
          palette
        }
      }
    }
  }

  get incrementValue() {
    return (this.control & CONTROL.INCREMENT_MODE) > 0 ? 32 : 1
  }

  insertCartridge(cartridge) {
    this.cartridge = cartridge
  }

  reset() {
    this.isFrameComplete = false

    this.scanline = 0
    this.cycle = 0

    this.addressLatch = 0x00
    this.ppuDataBuffer = 0x00
    this.ppuAddress = 0x0000
    this.oamAddress = 0x0000

    this.status = 0
    this.mask = 0
    this.control = 0

    this.vramAddress = 0
    this.tramAddress = 0

    this.shifter.reset()
    this.fineX = 0

    this.nmi = false

    this.bgNextTile = {
      id: 0,
      attrib: 0,
      lsb: 0,
      msb: 0
    }

    this.bSpriteZeroHitPossible = false
    this.bSpriteZeroBeingRendered = false
  }

  get isRenderSomthing() {
    return (
      (this.mask & MASK.RENDER_BG) > 0 || (this.mask & MASK.RENDER_SPRITES) > 0
    )
  }

  incrementScrollX() {
    if (this.isRenderSomthing) {
      const prevCoarseX = getLoopy(this.vramAddress, LOOPY_REG.COARSE_X)

      if (prevCoarseX === 31) {
        this.vramAddress = setLoopy(this.vramAddress, 0, LOOPY_REG.COARSE_X)
        this.vramAddress ^= LOOPY_REG.NAMETABLE_X.flags
      } else {
        this.vramAddress = setLoopy(
          this.vramAddress,
          prevCoarseX + 1,
          LOOPY_REG.COARSE_X
        )
      }
    }
  }

  incrementScrollY() {
    if (this.isRenderSomthing) {
      const prevFineY = getLoopy(this.vramAddress, LOOPY_REG.FINE_Y)
      const prevCoarseY = getLoopy(this.vramAddress, LOOPY_REG.COARSE_Y)
      if (prevFineY < 7) {
        this.vramAddress = setLoopy(
          this.vramAddress,
          prevFineY + 1,
          LOOPY_REG.FINE_Y
        )
      } else {
        this.vramAddress = setLoopy(this.vramAddress, 0, LOOPY_REG.FINE_Y)
        if (prevCoarseY === 29) {
          this.vramAddress = setLoopy(this.vramAddress, 0, LOOPY_REG.COARSE_Y)
          this.vramAddress ^= LOOPY_REG.NAMETABLE_Y.flags
        } else if (prevCoarseY === 31) {
          this.vramAddress = setLoopy(this.vramAddress, 0, LOOPY_REG.COARSE_Y)
        } else {
          this.vramAddress = setLoopy(
            this.vramAddress,
            prevCoarseY + 1,
            LOOPY_REG.COARSE_Y
          )
        }
      }
    }
  }

  transferAddressX() {
    if (this.isRenderSomthing) {
      this.vramAddress = setLoopy(
        this.vramAddress,
        getLoopy(this.tramAddress, LOOPY_REG.NAMETABLE_X),
        LOOPY_REG.NAMETABLE_X
      )
      this.vramAddress = setLoopy(
        this.vramAddress,
        getLoopy(this.tramAddress, LOOPY_REG.COARSE_X),
        LOOPY_REG.COARSE_X
      )
    }
  }

  transferAddressY() {
    if (this.isRenderSomthing) {
      this.vramAddress = setLoopy(
        this.vramAddress,
        getLoopy(this.tramAddress, LOOPY_REG.FINE_Y),
        LOOPY_REG.FINE_Y
      )
      this.vramAddress = setLoopy(
        this.vramAddress,
        getLoopy(this.tramAddress, LOOPY_REG.NAMETABLE_Y),
        LOOPY_REG.NAMETABLE_Y
      )
      this.vramAddress = setLoopy(
        this.vramAddress,
        getLoopy(this.tramAddress, LOOPY_REG.COARSE_Y),
        LOOPY_REG.COARSE_Y
      )
    }
  }

  clock() {
    if (this.scanline >= -1 && this.scanline < 240) {
      if (this.scanline === -1 && this.cycle === 1) {
        this.status &= ~(
          STATUS.VERTICAL_BLANK |
          STATUS.SPRITE_OVERFLOW |
          STATUS.SPRITE_ZERO_HIT
        )

        this.shifter.resetSpriteShifter()
      }

      if (
        (this.cycle > 1 && this.cycle < 258) ||
        (this.cycle > 320 && this.cycle < 338)
      ) {
        this.shifter.updateShifter()

        const patternBg = (this.control & CONTROL.PATTERN_BG) > 0 ? 1 : 0
        const fineY = getLoopy(this.vramAddress, LOOPY_REG.FINE_Y)
        switch ((this.cycle - 1) % 8) {
          case 0:
            this.shifter.loadBgShifter()
            this.bgNextTile.id = this.ppuRead(
              0x2000 | (this.vramAddress & 0x0fff)
            )
            break
          case 2:
            this.bgNextTile.attrib = this.ppuRead(
              0x23c0 |
                // (this.vramAddress.nametableY << 11) |
                // (this.vramAddress.nametableX << 10) |
                (this.vramAddress & 0b0000_1100_0000_0000) |
                // ((this.vramAddress.coarseY >> 2) << 3) |
                ((this.vramAddress & 0b0000_0011_1000_0000) >> 4) |
                // (this.vramAddress.coarseX >> 2)
                ((this.vramAddress >> 2) & 0b111)
            )
            // if ((this.vramAddress.coarseY & 0x02) > 0) {
            if ((this.vramAddress & 0x40) > 0) {
              this.bgNextTile.attrib >>= 4
            }
            // if ((this.vramAddress.coarseX & 0x02) > 0) {
            if ((this.vramAddress & 0x02) > 0) {
              this.bgNextTile.attrib >>= 2
            }
            this.bgNextTile.attrib &= 0x03
            break
          case 4:
            this.bgNextTile.lsb = this.ppuRead(
              (patternBg << 12) + (this.bgNextTile.id << 4) + fineY + 0
            )
            break
          case 6:
            this.bgNextTile.msb = this.ppuRead(
              (patternBg << 12) + (this.bgNextTile.id << 4) + fineY + 8
            )
            break
          case 7:
            this.incrementScrollX()
            break
          default:
            break
        }
      }

      if (this.cycle === 256) {
        this.incrementScrollY()
      }

      if (this.cycle === 257) {
        this.shifter.loadBgShifter()
        this.transferAddressX()
      }

      if (this.cycle === 338 || this.cycle === 340) {
        this.bgNextTile.id = this.ppuRead(0x2000 | (this.vramAddress & 0x0fff))
      }

      if (this.scanline === -1 && this.cycle >= 280 && this.cycle < 305) {
        this.transferAddressY()
      }

      // Render the foreground (sprites!)
      // This part is different from what the actual PPU is doing

      // First find sprites needed to be rendered
      if (this.cycle === 257 && this.scanline >= 0) {
        this.spriteScanline.forEach((oam) => oam.reset())
        this.spriteCount = 0
        this.shifter.resetSpriteShifter()

        let oamEntry = 0
        this.bSpriteZeroHitPossible = false
        while (oamEntry < 64 && this.spriteCount < 9) {
          const diff = this.scanline - this.oam[oamEntry].y

          if (
            diff >= 0 &&
            diff < ((this.control & CONTROL.SPRITE_SIZE) > 0 ? 16 : 8)
          ) {
            if (this.spriteCount < 8) {
              if (oamEntry === 0) this.bSpriteZeroHitPossible = true
              this.spriteScanline[this.spriteCount].transfer(this.oam[oamEntry])
            }

            this.spriteCount++
          }

          oamEntry++
        }

        if (this.spriteCount > 8) {
          this.status &= ~STATUS.SPRITE_OVERFLOW
          this.status |= STATUS.SPRITE_OVERFLOW
          this.spriteCount = 8
        }
      }

      // Extract the sprite data
      if (this.cycle === 340) {
        for (let i = 0; i < this.spriteCount; i++) {
          let spritePatternAddressLo

          const patternSprite =
            (this.control & CONTROL.PATTERN_SPRITE) > 0 ? 1 : 0
          if ((this.control & CONTROL.SPRITE_SIZE) === 0) {
            // 8x8 sprite mode
            if (!((this.spriteScanline[i].attrib & 0x80) > 0)) {
              // Sprite is normal, not flipped
              spritePatternAddressLo =
                (patternSprite << 12) | // in 0k or 4k range
                (this.spriteScanline[i].id << 4) | // each tile is 16 bytes in size
                (this.scanline - this.spriteScanline[i].y)
            } else {
              // The sprite is flipped vertically
              spritePatternAddressLo =
                (patternSprite << 12) | // in 0k or 4k range
                (this.spriteScanline[i].id << 4) | // each tile is 16 bytes in size
                (7 - (this.scanline - this.spriteScanline[i].y))
            }
          } else {
            // 8x16 sprite mode
            if (!((this.spriteScanline[i].attrib & 0x80) > 0)) {
              // Sprite is normal, not flipped
              if (this.scanline - this.spriteScanline[i].y < 8) {
                // reading top half
                spritePatternAddressLo =
                  ((this.spriteScanline[i].id & 0x01) << 12) |
                  ((this.spriteScanline[i].id & 0xfe) << 4) |
                  ((this.scanline - this.spriteScanline[i].y) & 0x07)
              } else {
                // reading bottom half
                spritePatternAddressLo =
                  ((this.spriteScanline[i].id & 0x01) << 12) |
                  (((this.spriteScanline[i].id & 0xfe) + 1) << 4) |
                  ((this.scanline - this.spriteScanline[i].y) & 0x07)
              }
            } else {
              // The sprite is flipped vertically
              if (this.scanline - this.spriteScanline[i].y < 8) {
                // reading top half
                spritePatternAddressLo =
                  ((this.spriteScanline[i].id & 0x01) << 12) |
                  ((this.spriteScanline[i].id & 0xfe) << 4) |
                  (7 - ((this.scanline - this.spriteScanline[i].y) & 0x07))
              } else {
                // reading bottom half
                // eslint-disable-next-line
                spritePatternAddressLo =
                  ((this.spriteScanline[i].id & 0x01) << 12) |
                  (((this.spriteScanline[i].id & 0xfe) + 1) << 4) |
                  (7 - ((this.scanline - this.spriteScanline[i].y) & 0x07))
              }
            }
          }

          // eslint-disable-next-line
          const spritePatternAddressHi = spritePatternAddressLo + 8
          // eslint-disable-next-line
          let spritePatternBitLo = this.ppuRead(spritePatternAddressLo)
          // eslint-disable-next-line
          let spritePatternBitHi = this.ppuRead(spritePatternAddressHi)

          const isFlippedHorizontally =
            (this.spriteScanline[i].attrib & 0x40) > 0

          if (isFlippedHorizontally) {
            //
            const flipByte = (b) => {
              b = ((b & 0xf0) >> 4) | ((b & 0x0f) << 4)
              b = ((b & 0xcc) >> 2) | ((b & 0x33) << 2)
              b = ((b & 0xaa) >> 1) | ((b & 0x55) << 1)
              return b
            }

            spritePatternBitLo = flipByte(spritePatternBitLo)
            spritePatternBitHi = flipByte(spritePatternBitHi)
          }

          this.shifter.spritePatternLo[i] = spritePatternBitLo
          this.shifter.spritePatternHi[i] = spritePatternBitHi
        }
      }
    }

    if (this.scanline === 240) {
      // Nothing is real...new
      // nothing happens here
    }

    if (this.scanline === 241 && this.cycle === 1) {
      this.status |= STATUS.VERTICAL_BLANK

      if ((this.control & CONTROL.ENABLENMI) > 0) {
        this.nmi = true
      }
    }

    const { pixel, palette } = this.shifter.yieldPixel()

    this.screen.setColor(
      this.cycle - 1,
      this.scanline,
      this.getColorFromPaletteRAM(palette, pixel)
    )

    this.cycle += 1

    if (this.cycle >= 341) {
      this.cycle = 0
      this.scanline += 1

      if (this.scanline >= 261) {
        this.scanline = -1
        this.isFrameComplete = true
      }
    }
  }

  getScreen() {
    return this.screen
  }

  // getTableName(i) {
  //   return this.screenTableName[i]
  // }

  getPatternTable(i, palette = 0) {
    for (let tileY = 0; tileY < 16; tileY++) {
      for (let tileX = 0; tileX < 16; tileX++) {
        const offset = tileY * 256 + tileX * 16

        for (let row = 0; row < 8; row++) {
          let tileLSB = this.ppuRead(i * 0x1000 + offset + row + 0)
          let tileMSB = this.ppuRead(i * 0x1000 + offset + row + 8)

          for (let col = 0; col < 8; col++) {
            const pixel = ((tileLSB & 0x01) << 1) | (tileMSB & 0x01)

            tileLSB >>= 1
            tileMSB >>= 1

            this.screenPatternTable[i].setColor(
              tileX * 8 + (7 - col),
              tileY * 8 + row,
              this.getColorFromPaletteRAM(palette, pixel)
            )
          }
        }
      }
    }
    return this.screenPatternTable[i]
  }

  getColorFromPaletteRAM(palette, pixel) {
    const paletteId = this.ppuRead(0x3f00 + (palette << 2) + pixel)

    return palScreen[paletteId]
  }

  cpuRead(addr, isReadOnly = false) {
    // eslint-disable-next-line prefer-const
    let data = 0

    if (isReadOnly) {
      switch (addr) {
        case 0x0000: // Control
          data = 0xff // this.control
          break
        case 0x0001: // Mask
          data = 0xff // this.mask
          break
        case 0x0002: // Status
          data = 0xff // this.status
          break
        case 0x0003: // OAM Address
          break
        case 0x0004: // OAM Data
          break
        case 0x0005: // Scroll
          break
        case 0x0006: // PPU Address
          break
        case 0x0007: // PPU Data
          break
        default:
          break
      }
    } else {
      switch (addr) {
        case 0x0000: // Control
          break
        case 0x0001: // Mask
          break
        case 0x0002: // Status
          data = (this.status & 0xe0) | (this.ppuDataBuffer & 0x1f)
          this.status &= ~STATUS.VERTICAL_BLANK
          this.addressLatch = 0
          break
        case 0x0003: // OAM Address
          break
        case 0x0004: // OAM Data
          data = this.oam[(this.oamAddress / 4) >> 0].values[
            this.oamAddress % 4
          ]
          break
        case 0x0005: // Scroll
          break
        case 0x0006: // PPU Address
          break
        case 0x0007: // PPU Data
          data = this.ppuDataBuffer
          this.ppuDataBuffer = this.ppuRead(this.vramAddress)

          if (this.vramAddress >= 0x3f00) {
            data = this.ppuDataBuffer
          }

          this.vramAddress += this.incrementValue
          break
        default:
          break
      }
    }

    return data
  }

  writeToOAM(address, value) {
    const oamId = (address / 4) >> 0
    const oamAttrib = address % 4
    this.oam[oamId].values[oamAttrib] = value
  }

  cpuWrite(addr, value) {
    switch (addr) {
      case 0x0000: // Control
        this.control = value
        // this.tramAddress.nametableX =
        //   (this.control & CONTROL.NAMETABLE_X) > 0 ? 1 : 0
        // this.tramAddress.nametableY =
        //   (this.control & CONTROL.NAMETABLE_Y) > 0 ? 1 : 0
        this.tramAddress &= ~(
          LOOPY_REG.NAMETABLE_X.flags | LOOPY_REG.NAMETABLE_Y.flags
        )
        this.tramAddress |=
          (this.control & (CONTROL.NAMETABLE_X | CONTROL.NAMETABLE_Y)) << 10
        break
      case 0x0001: // Mask
        this.mask = value
        break
      case 0x0002: // Status
        // this.status = value
        break
      case 0x0003: // OAM Address
        this.oamAddress = value
        break
      case 0x0004: // OAM Data
        this.writeToOAM(this.oamAddress, value)
        break
      case 0x0005: // Scroll
        if (this.addressLatch === 0) {
          this.fineX = value & 0x07
          // this.tramAddress.coarseX = value >> 3
          this.tramAddress = setLoopy(
            this.tramAddress,
            value >> 3,
            LOOPY_REG.COARSE_X
          )
          this.addressLatch = 1
        } else {
          this.tramAddress = setLoopy(
            this.tramAddress,
            value & 0x07,
            LOOPY_REG.FINE_Y
          )
          this.tramAddress = setLoopy(
            this.tramAddress,
            value >> 3,
            LOOPY_REG.COARSE_Y
          )
          this.addressLatch = 0
        }
        break
      case 0x0006: // PPU Address
        if (this.addressLatch === 0) {
          this.tramAddress = ((value & 0x3f) << 8) | (this.tramAddress & 0x00ff)
          this.addressLatch = 1
        } else {
          this.tramAddress = (this.tramAddress & 0xff00) | value
          this.vramAddress = this.tramAddress
          this.addressLatch = 0
        }
        break
      case 0x0007: // PPU Data
        this.ppuWrite(this.vramAddress, value)
        this.vramAddress += this.incrementValue
        break
      default:
        break
    }
  }

  ppuRead(addr) {
    addr = addr & 0x3fff
    let data = this.cartridge.ppuRead(addr)

    if (data !== null) {
      // TODO: implement this later
    } else if (addr < 0x2000) {
      data = this.tablePattern[(addr & 0x1000) >> 12][addr & 0x0fff]
    } else if (addr < 0x3f00) {
      addr = addr & 0x0fff
      if (this.cartridge.mirrorMode === MIRROR_MODE.VERTICAL) {
        if (addr < 0x0400) {
          data = this.tableName[0][addr & 0x03ff]
        } else if (addr < 0x0800) {
          data = this.tableName[1][addr & 0x03ff]
        } else if (addr < 0x0c00) {
          data = this.tableName[0][addr & 0x03ff]
        } else {
          data = this.tableName[1][addr & 0x03ff]
        }
      } else if (this.cartridge.mirrorMode === MIRROR_MODE.HORIZONTAL) {
        if (addr < 0x0400) {
          data = this.tableName[0][addr & 0x03ff]
        } else if (addr < 0x0800) {
          data = this.tableName[0][addr & 0x03ff]
        } else if (addr < 0x0c00) {
          data = this.tableName[1][addr & 0x03ff]
        } else {
          data = this.tableName[1][addr & 0x03ff]
        }
      }
    } else if (addr < 0x3fff) {
      addr = addr & 0x001f

      if (addr >= 0x0010 && addr % 4 === 0) {
        addr = addr & 0x000f
      }

      data = this.tablePalette[addr]
    } else {
      data = 0
    }

    return data
  }

  ppuWrite(addr, value) {
    addr = addr & 0x3fff
    if (this.cartridge.ppuWrite(addr, value)) {
      // TODO: implement this later
    } else if (addr < 0x2000) {
      this.tablePattern[(addr & 0x1000) >> 12][addr & 0x0fff] = value
    } else if (addr < 0x3f00) {
      addr = addr & 0x0fff
      if (this.cartridge.mirrorMode === MIRROR_MODE.VERTICAL) {
        if (addr < 0x0400) {
          this.tableName[0][addr & 0x03ff] = value
        } else if (addr < 0x0800) {
          this.tableName[1][addr & 0x03ff] = value
        } else if (addr < 0x0c00) {
          this.tableName[0][addr & 0x03ff] = value
        } else {
          this.tableName[1][addr & 0x03ff] = value
        }
      } else if (this.cartridge.mirrorMode === MIRROR_MODE.HORIZONTAL) {
        if (addr < 0x0400) {
          this.tableName[0][addr & 0x03ff] = value
        } else if (addr < 0x0800) {
          this.tableName[0][addr & 0x03ff] = value
        } else if (addr < 0x0c00) {
          this.tableName[1][addr & 0x03ff] = value
        } else {
          this.tableName[1][addr & 0x03ff] = value
        }
      }
    } else if (addr < 0x3fff) {
      addr = addr & 0x001f

      if (addr >= 0x0010 && addr % 4 === 0) {
        addr = addr & 0x000f
      }

      this.tablePalette[addr] = value
    }
  }
}
