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

  async parse(fileObj) {
    const reader = new FileReader()
    const data = await new Promise((resolve, reject) => {
      reader.addEventListener('load', (event) => {
        resolve(event.target.result)
      })

      reader.readAsArrayBuffer(fileObj)
    })
    const view = new Uint8Array(data)

    const mapper1 = view[6]
    const mapper2 = view[7]

    this.mapperId = ((mapper2 >> 4) << 4) | (mapper1 >> 4)
    this.mirrorMode =
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
      this.chrMemory = view.slice(
        seekPosition,
        seekPosition + this.chrBankNumber * 8192
      )
    } else if (nFileType === 2) {
    }

    const MapperClass = mappers[this.mapperId]

    if (MapperClass)
      this.mapper = new MapperClass(this.prgBankNumber, this.chrBankNumber)
  }

  cpuRead(addr) {
    const { status, mappedAddress } = this.mapper.cpuMapRead(addr)

    if (status) {
      return this.prgMemory[mappedAddress]
    }

    return null
  }

  cpuWrite(addr, value) {
    const { status, mappedAddress } = this.mapper.cpuMapWrite(addr)

    if (status) {
      this.prgMemory[mappedAddress] = value
      return true
    }

    return null
  }

  ppuRead(addr) {
    const { status, mappedAddress } = this.mapper.ppuMapRead(addr)

    if (status) {
      return this.chrMemory[mappedAddress]
    }

    return null
  }

  ppuWrite(addr, value) {
    const { status, mappedAddress } = this.mapper.ppuMapWrite(addr)

    if (status) {
      this.chrMemory[mappedAddress] = value
      return true
    }

    return null
  }
}
