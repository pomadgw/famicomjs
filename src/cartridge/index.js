import mappers from '../mappers'
import MIRROR_MODE from '../ppu/mirror-mode'

export default class Cartridge {
  constructor() {
    this.prgMemory = []
    this.chrMemory = []

    this.mapperId = 0
    this.prgBankNumber = 0
    this.chrBankNumber = 0
  }

  parse(view) {
    const mapper1 = view[6]
    const mapper2 = view[7]

    this.mapperId = ((mapper2 >> 4) << 4) | (mapper1 >> 4)
    this.hwMirrorMode =
      (mapper1 & 0x01) > 0 ? MIRROR_MODE.VERTICAL : MIRROR_MODE.HORIZONTAL

    let seekPosition = 16

    if ((mapper1 & 0x04) > 0) {
      seekPosition += 512
    }

    const nFileType = 1

    if (nFileType === 0) {
    } else if (nFileType === 1) {
      this.prgBankNumber = view[4]
      this.chrBankNumber = view[5]
      this.prgMemory = view.slice(
        seekPosition,
        seekPosition + this.prgBankNumber * 16384
      )
      seekPosition += this.prgBankNumber * 16384
      if (this.chrBankNumber === 0) {
        this.chrMemory = new Uint8Array(0x2000)
      } else {
        this.chrMemory = view.slice(
          seekPosition,
          seekPosition + this.chrBankNumber * 8192
        )
      }
    } else if (nFileType === 2) {
    }

    const MapperClass = mappers[this.mapperId]

    if (MapperClass)
      this.mapper = new MapperClass(this.prgBankNumber, this.chrBankNumber)
    else {
      // throw new Error(`Unsupported mapper: ${this.mapperId}`)
    }
  }

  reset() {
    if (this.mapper) this.mapper.reset()
  }

  get mirrorMode() {
    const mirrorMode = this.mapper?.mirror()
    if (mirrorMode) return mirrorMode
    return this.hwMirrorMode
  }

  cpuRead(addr) {
    const { status, mappedAddress, value } = this.mapper.cpuMapRead(addr)

    if (status) {
      return value ?? this.prgMemory[mappedAddress]
    }

    return null
  }

  cpuWrite(addr, value) {
    const {
      status,
      mappedAddress,
      value: isInternalChanged
    } = this.mapper.cpuMapWrite(addr, value)

    if (status) {
      if (isInternalChanged) return true
      this.prgMemory[mappedAddress] = value
      return true
    }

    return null
  }

  ppuRead(addr) {
    const { status, mappedAddress } = this.mapper.ppuMapRead(addr)
    if (status) {
      process.stdout.write(
        `cart: read from PPU from ${mappedAddress}: ${this.chrMemory[
          mappedAddress
        ]
          .toString(16)
          .padStart(2, '0')}\n`
      )
      return this.chrMemory[mappedAddress]
    }

    return null
  }

  ppuWrite(addr, value) {
    const { status, mappedAddress, write } = this.mapper.ppuMapWrite(
      addr,
      value
    )

    process.stderr.write(`cart: write to PPU ${status}\n`)

    if (status) {
      if (write) {
        process.stdout.write(
          `cart: write to PPU ${mappedAddress}: ${value
            .toString(16)
            .padStart(2, '0')}\n`
        )
        this.chrMemory[mappedAddress] = value
      }
      return true
    }

    return null
  }
}
