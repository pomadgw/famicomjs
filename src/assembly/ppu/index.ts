/* eslint-disable @typescript-eslint/no-empty-function */
import Bitfield from '../utils/bitfield'
import { BitfieldSize } from '../utils/bitfield'
import Cartridge from '../cartridge'
import { MirrorMode } from '../utils/mirror-mode'
import Screen from '../utils/screen'
import { RGB } from '../utils/screen'

export const palScreen: RGB[] = [
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

class Pixel {
  public pixel: u8
  public palette: u8
}

class BgShifter {
  private ppu: PPU | null

  private patternLo: u8
  private patternHi: u8
  private attribLo: u8
  private attribHi: u8

  constructor() {
    this.ppu = null

    this.patternLo = 0
    this.patternHi = 0

    this.attribLo = 0
    this.attribHi = 0
  }

  reset(): void {
    this.patternLo = 0
    this.patternHi = 0

    this.attribLo = 0
    this.attribHi = 0
  }

  setPPU(ppu: PPU): void {
    this.ppu = ppu
  }

  loadBgShifter(): void {
    if (this.ppu) {
      this.patternLo = (this.patternLo & 0xff00) | this.ppu.bgNextTileLsb
      this.patternHi = (this.patternHi & 0xff00) | this.ppu.bgNextTileMsb

      this.attribLo =
        (this.attribLo & 0xff00) |
        ((this.ppu.bgNextTileAttrib & 0x01) > 0 ? 0xff : 0)
      this.attribHi =
        (this.attribHi & 0xff00) |
        ((this.ppu.bgNextTileAttrib & 0x02) > 0 ? 0xff : 0)
    }
  }

  updateShifter(): void {
    if (this.ppu && this.ppu.maskReg.getAsBoolean('bRenderBg')) {
      this.patternLo <<= 1
      this.patternHi <<= 1

      this.attribLo <<= 1
      this.attribHi <<= 1
    }
  }

  yieldBgPixel(): Pixel {
    if (!this.ppu || !this.ppu.maskReg.getAsBoolean('bRenderBg')) {
      return { pixel: 0, palette: 0 }
    }

    const bitmux: u16 = 0x8000 >> this.ppu.fineX
    const p0Pixel = (this.patternLo & bitmux) > 0 ? 1 : 0
    const p1Pixel = (this.patternHi & bitmux) > 0 ? 1 : 0
    const bgPal0 = (this.attribLo & bitmux) > 0 ? 1 : 0
    const bgPal1 = (this.attribHi & bitmux) > 0 ? 1 : 0

    return { pixel: (p1Pixel << 1) | p0Pixel, palette: (bgPal1 << 1) | bgPal0 }
  }
}

export default class PPU {
  public cartridge: Cartridge | null
  public screen: Screen
  public cycle: u32
  public scanline: u32
  public isFrameComplete: bool
  public nmi: bool

  private tableName: Uint8Array[]
  private tablePattern: Uint8Array[]
  private tablePalette: Uint8Array
  public statusReg: Bitfield
  public maskReg: Bitfield
  public controlReg: Bitfield

  private addressLatch: u8
  private ppuDataBuffer: u8
  private ppuAddress: u16
  private vramAddress: Bitfield
  private tramAddress: Bitfield
  public fineX: u8
  private bgShifter: BgShifter

  public bgNextTileId: u8 = 0
  public bgNextTileAttrib: u8 = 0
  public bgNextTileLsb: u8 = 0
  public bgNextTileMsb: u8 = 0

  constructor() {
    this.cartridge = null
    this.screen = new Screen(256, 240)
    this.cycle = 0
    this.scanline = 0
    this.isFrameComplete = false

    this.tableName = [new Uint8Array(1024), new Uint8Array(1024)]
    this.tablePattern = [new Uint8Array(4096), new Uint8Array(4096)]
    this.tablePalette = new Uint8Array(32)

    this.statusReg = new Bitfield([
      new BitfieldSize('_unused', 5),
      new BitfieldSize('spriteOverflow', 1),
      new BitfieldSize('spriteZeroHit', 1),
      new BitfieldSize('verticalBlank', 1)
    ])

    this.maskReg = new Bitfield([
      new BitfieldSize('grayscale', 1),
      new BitfieldSize('renderBgLeft', 1),
      new BitfieldSize('renderSpritesLeft', 1),
      new BitfieldSize('renderBg', 1),
      new BitfieldSize('renderSprites', 1),
      new BitfieldSize('enhanceRed', 1),
      new BitfieldSize('enhanceGreen', 1),
      new BitfieldSize('enhanceBlue', 1)
    ])

    this.controlReg = new Bitfield([
      new BitfieldSize('nametableX', 1),
      new BitfieldSize('nametableY', 1),
      new BitfieldSize('incrementMode', 1),
      new BitfieldSize('patternSprite', 1),
      new BitfieldSize('patternBg', 1),
      new BitfieldSize('spriteSize', 1),
      new BitfieldSize('slaveMode', 1),
      new BitfieldSize('enablenmi', 1)
    ])

    this.addressLatch = 0x00
    this.ppuDataBuffer = 0x00
    this.ppuAddress = 0x0000

    const loopyRegister = (): Bitfield =>
      new Bitfield([
        new BitfieldSize('coarseX', 5),
        new BitfieldSize('coarseY', 5),
        new BitfieldSize('nametableX', 1),
        new BitfieldSize('nametableY', 1),
        new BitfieldSize('fineY', 3),
        new BitfieldSize('unused', 1)
      ])

    this.vramAddress = loopyRegister()
    this.tramAddress = loopyRegister()

    this.fineX = 0

    this.nmi = false

    this.bgShifter = new BgShifter()
    this.bgShifter.setPPU(this)
  }

  insertCartridge(cart: Cartridge): void {
    this.cartridge = cart
  }

  reset(): void {
    this.cycle = 0
    this.scanline = 0
    this.isFrameComplete = false

    this.addressLatch = 0x00
    this.ppuDataBuffer = 0x00
    this.ppuAddress = 0x0000

    this.statusReg.value = 0
    this.controlReg.value = 0
    this.maskReg.value = 0
    this.vramAddress.value = 0
    this.tramAddress.value = 0

    this.bgShifter.reset()
    this.fineX = 0

    this.nmi = false

    this.bgNextTileId = 0
    this.bgNextTileAttrib = 0
    this.bgNextTileLsb = 0
    this.bgNextTileMsb = 0
  }

  private get incrementValue(): u8 {
    return this.controlReg.get('incrementMode') === 1 ? 32 : 1
  }

  clock(): void {}

  getColorFromPaletteRAM(palette: u8, pixel: u8): RGB {
    const paletteId = this.ppuRead(0x3f00 + (palette << 2) + pixel)

    return palScreen[paletteId]
  }

  cpuRead(address: u16, isReadOnly: bool): u8 {
    let data: u8 = 0

    switch (address) {
      case 0x0000: // Control
        break
      case 0x0001: // Mask
        break
      case 0x0002: // Status
        data =
          ((this.statusReg.value & 0xe0) as u8) | (this.ppuDataBuffer & 0x1f)
        if (!isReadOnly) {
          this.statusReg.set('verticalBlank', 0)
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
        this.ppuDataBuffer = this.ppuRead(this.vramAddress.value as u16)

        if (this.vramAddress.value >= 0x3f00) {
          data = this.ppuDataBuffer
        }

        if (!isReadOnly) this.vramAddress.value += this.incrementValue
        break
      default:
        break
    }

    return data
  }
  cpuWrite(address: u16, value: u8): void {
    switch (address) {
      case 0x0000: // Control
        this.controlReg.value = value
        this.tramAddress.set('nametableX', this.controlReg.get('nametableX'))
        this.tramAddress.set('nametableY', this.controlReg.get('nametableY'))
        break
      case 0x0001: // Mask
        this.maskReg.value = value
        break
      case 0x0002: // Status
        this.statusReg.value = value
        break
      case 0x0003: // OAM Address
        break
      case 0x0004: // OAM Data
        break
      case 0x0005: // Scroll
        if (this.addressLatch === 0) {
          this.fineX = value & 0x07
          this.tramAddress.set('coarseX', value >> 3)
          this.addressLatch = 1
        } else {
          this.tramAddress.set('fineY', value & 0x07)
          this.tramAddress.set('coarseY', value >> 3)
          this.addressLatch = 0
        }
        break
      case 0x0006: // PPU Address
        if (this.addressLatch === 0) {
          this.tramAddress.value =
            (this.tramAddress.value & 0x00ff) | (value << 8)
          this.addressLatch = 1
        } else {
          this.tramAddress.value = (this.tramAddress.value & 0xff00) | value
          this.vramAddress.value = this.tramAddress.value
          this.addressLatch = 0
        }
        break
      case 0x0007: // PPU Data
        this.ppuWrite(this.vramAddress.value as u16, value)
        this.vramAddress.value += this.incrementValue
        break
      default:
        break
    }
  }

  ppuRead(addr: u16): u8 {
    addr = addr & 0x3fff
    let data: u8 = 0

    const cartridge = this.cartridge // as Cartridge
    if (cartridge !== null) {
      const cartridgeData = cartridge.ppuRead(addr)

      if (!cartridgeData.error) {
        // TODO: implement this later
        data = 0
      } else if (addr < 0x2000) {
        data = this.tablePattern[(addr & 0x1000) >> 12][addr & 0x0fff]
      } else if (addr < 0x3f00) {
        addr = addr & 0x0fff
        if (cartridge.mirrorMode === MirrorMode.VERTICAL) {
          if (addr < 0x0400) {
            data = this.tableName[0][addr & 0x03ff]
          } else if (addr < 0x0800) {
            data = this.tableName[1][addr & 0x03ff]
          } else if (addr < 0x0c00) {
            data = this.tableName[0][addr & 0x03ff]
          } else {
            data = this.tableName[1][addr & 0x03ff]
          }
        } else if (cartridge.mirrorMode === MirrorMode.HORIZONTAL) {
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
    }

    return data
  }
  ppuWrite(address: u16, value: u8): void {}
}
