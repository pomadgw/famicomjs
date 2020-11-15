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

class BgShifer {
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
  private bgShifer: BgShifer

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

    this.bgShifer = new BgShifer()
    this.bgShifer.setPPU(this)
  }

  insertCartridge(cart: Cartridge): void {
    this.cartridge = cart
  }

  clock(): void {}

  cpuRead(address: u16): u8 {
    return 0
  }
  cpuWrite(address: u16, value: u8): void {}

  ppuRead(address: u16): u8 {
    return 0
  }
  ppuWrite(address: u16, value: u8): void {}
}
