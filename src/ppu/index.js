export default class PPU {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    this.tableName = [new Uint8Array(1024), new Uint8Array(1024)]
    this.tablePalette = new Uint8Array(32)
  }

  insertCartridge(cartridge) {
    this.cartridge = cartridge
  }

  clock() {}

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

  ppuRead(_addr) {
    return 0
  }

  ppuWrite(_addr, _value) {}
}
