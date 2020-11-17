import Mapper from './mapper'

export default class Mapper000 extends Mapper {
  cpuMapRead(address) {
    const isWithinRange = address >= 0x8000 && address <= 0xffff

    if (isWithinRange)
      return {
        status: isWithinRange,
        mappedAddress: address & (this.prgBankNumber > 1 ? 0x7fff : 0x3fff)
      }

    return { status: false }
  }

  cpuMapWrite(address) {
    const isWithinRange = address >= 0x8000 && address <= 0xffff

    if (isWithinRange)
      return {
        status: isWithinRange,
        mappedAddress: address & (this.prgBankNumber > 1 ? 0x7fff : 0x3fff)
      }

    return { status: false }
  }

  ppuMapRead(address) {
    const isWithinRange = address >= 0x0000 && address <= 0x1fff

    return {
      status: isWithinRange,
      mappedAddress: address
    }
  }

  ppuMapWrite(address) {
    return {
      status: false
    }
  }
}
