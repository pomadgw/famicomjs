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

export default class PPU {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    this.tableName = [new Uint8Array(1024), new Uint8Array(1024)]
    this.tablePalette = new Uint8Array(32)

    this.screen = new Screen(256, 240)
    // for debugging purposes
    this.screenTableName = [new Screen(256, 240), new Screen(256, 240)]
    this.screenPatternTable = [new Screen(128, 128), new Screen(128, 128)]

    this.isFrameComplete = false

    this.scanline = 0
    this.cycle = 0
  }

  insertCartridge(cartridge) {
    this.cartridge = cartridge
  }

  clock() {
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

  // getPatternTable(i) {
  //   return this.screenPatternTable[i]
  // }

  cpuRead(addr) {
    // eslint-disable-next-line prefer-const
    let data = 0

    // TODO: implement this later
    // switch (addr) {
    //   case 0x0000: // Control
    //     break
    //   case 0x0001: // Mask
    //     break
    //   case 0x0002: // Status
    //     break
    //   case 0x0003: // OAM Address
    //     break
    //   case 0x0004: // OAM Data
    //     break
    //   case 0x0005: // Scroll
    //     break
    //   case 0x0006: // PPU Address
    //     break
    //   case 0x0007: // PPU Data
    //     break
    //   default:
    //     break
    // }

    return data
  }

  cpuWrite(_addr, _value) {
    // TODO: implement this later
    // switch (addr) {
    //   case 0x0000: // Control
    //     break
    //   case 0x0001: // Mask
    //     break
    //   case 0x0002: // Status
    //     break
    //   case 0x0003: // OAM Address
    //     break
    //   case 0x0004: // OAM Data
    //     break
    //   case 0x0005: // Scroll
    //     break
    //   case 0x0006: // PPU Address
    //     break
    //   case 0x0007: // PPU Data
    //     break
    //   default:
    //     break
    // }
  }

  ppuRead(addr) {
    if (this.cartridge.ppuRead(addr)) {
      // TODO: implement this later
    }
    return 0
  }

  ppuWrite(addr, value) {
    if (this.cartridge.ppuWrite(addr, value)) {
      // TODO: implement this later
    }
  }
}
