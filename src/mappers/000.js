import generator from './mapper-generator'

export default generator({
  cpuMapReadFn(address) {
    const isWithinRange = address >= 0x8000 && address <= 0xffff

    if (isWithinRange)
      return {
        status: isWithinRange,
        mappedAddress: address & (this.prgBankNumber > 1 ? 0x7fff : 0x3fff)
      }

    return { status: false }
  },
  cpuMapWriteFn(address) {
    const isWithinRange = address >= 0x8000 && address <= 0xffff

    if (isWithinRange)
      return {
        status: isWithinRange,
        mappedAddress: address & (this.prgBankNumber > 1 ? 0x7fff : 0x3fff)
      }

    return { status: false }
  },
  ppuMapReadFn(address) {
    const isWithinRange = address >= 0x0000 && address <= 0x1fff

    return {
      status: isWithinRange,
      mappedAddress: address
    }
  },
  ppuMapWriteFn(address) {
    return {
      status: false
    }
  }
})
