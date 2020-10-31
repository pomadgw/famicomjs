import MIRROR_MODE from './mirror-mode'
import Screen from '../utils/screen'
import bitfield from '../utils/bitfield'

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

export default class PPU {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    this.tableName = [new Uint8Array(1024), new Uint8Array(1024)]
    this.tablePattern = [new Uint8Array(4096), new Uint8Array(4096)]
    this.tablePalette = new Uint8Array(32)

    this.screen = new Screen(256, 240)
    // for debugging purposes
    this.screenTableName = [new Screen(256, 240), new Screen(256, 240)]
    this.screenPatternTable = [new Screen(128, 128), new Screen(128, 128)]

    this.isFrameComplete = false

    this.scanline = 0
    this.cycle = 0

    this.statusReg = bitfield(
      [
        ['_unused', 5],
        ['spriteOverflow', 1],
        ['spriteZeroHit', 1],
        ['verticalBlank', 1]
      ],
      new Uint8Array([0])
    )

    this.maskReg = bitfield(
      [
        ['grayscale', 1],
        ['renderBgLeft', 1],
        ['renderSpritesLeft', 1],
        ['renderBg', 1],
        ['renderSprites', 1],
        ['enhanceRed', 1],
        ['enhanceGreen', 1],
        ['enhanceBlue', 1]
      ],
      new Uint8Array([0])
    )

    this.controlReg = bitfield(
      [
        ['nametableX', 1],
        ['nametableY', 1],
        ['incrementMode', 1],
        ['patternSprite', 1],
        ['patternBg', 1],
        ['spriteSize', 1],
        ['slaveMode', 1], // unused
        ['enablenmi', 1]
      ],
      new Uint8Array([0])
    )

    this.addressLatch = 0x00
    this.ppuDataBuffer = 0x00
    this.ppuAddress = 0x0000

    this.nmi = false
  }

  get incrementValue() {
    return this.controlReg.incrementMode === 1 ? 32 : 1
  }

  insertCartridge(cartridge) {
    this.cartridge = cartridge
  }

  clock() {
    if (this.scanline === -1 && this.cycle === 1) {
      this.statusReg.verticalBlank = 0
    }

    if (this.scanline === 241 && this.cycle === 1) {
      this.statusReg.verticalBlank = 1

      if (this.controlReg.enablenmi === 1) {
        this.nmi = true
      }
    }

    this.screen.setColor(
      this.cycle - 1,
      this.scanline,
      palScreen[Math.random() > 0.5 ? 0x3f : 0x30]
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
            const pixel = (tileLSB & 0x01) + (tileMSB & 0x01)

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

    // TODO: implement this later
    switch (addr) {
      case 0x0000: // Control
        break
      case 0x0001: // Mask
        break
      case 0x0002: // Status
        data = (this.statusReg.value & 0xe0) | (this.ppuDataBuffer & 0x1f)
        if (!isReadOnly) {
          this.statusReg.verticalBlank = 0
          this.addressLatch = 0
        }
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
        data = this.ppuDataBuffer
        this.ppuDataBuffer = this.ppuRead(this.ppuAddress)

        if (this.ppuAddress >= 0x3f00) {
          data = this.ppuDataBuffer
        }

        if (!isReadOnly) this.ppuAddress += this.incrementValue
        break
      default:
        break
    }

    return data
  }

  cpuWrite(addr, value) {
    // TODO: implement this later
    switch (addr) {
      case 0x0000: // Control
        this.statusReg.value = value
        break
      case 0x0001: // Mask
        this.maskReg.value = value
        break
      case 0x0002: // Status
        break
      case 0x0003: // OAM Address
        break
      case 0x0004: // OAM Data
        break
      case 0x0005: // Scroll
        break
      case 0x0006: // PPU Address
        if (this.addressLatch === 0) {
          this.ppuAddress = (this.ppuAddress & 0x00ff) | (value << 8)
          this.addressLatch = 1
        } else {
          this.ppuAddress = (this.ppuAddress & 0xff00) | value
          this.addressLatch = 0
        }
        break
      case 0x0007: // PPU Data
        this.ppuWrite(this.ppuAddress, value)
        this.ppuAddress += this.incrementValue
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
