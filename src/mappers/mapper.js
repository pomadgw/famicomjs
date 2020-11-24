export default class Mapper {
  constructor(prgBankNumber, chrBankNumber) {
    this.prgBankNumber = prgBankNumber
    this.chrBankNumber = chrBankNumber
  }

  mirror() {
    return null
  }

  reset() {}

  getRAM() {
    return null
  }

  loadRAM() {}

  cpuMapRead(addr) {
    return {
      status: false,
      mappedAddress: addr
    }
  }

  cpuMapWrite(addr) {
    return {
      status: false,
      mappedAddress: addr
    }
  }

  ppuMapRead(addr) {
    return {
      status: false,
      mappedAddress: addr
    }
  }

  ppuMapWrite(addr) {
    return {
      status: false,
      mappedAddress: addr
    }
  }
}
