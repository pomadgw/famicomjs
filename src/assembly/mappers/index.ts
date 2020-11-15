export class MappingResult {
  public status: bool
  public mappedAddress: u16
}

export class Mapper {
  public prgBankNumber: u8
  public chrBankNumber: u8

  constructor(prgBankNumber: u8, chrBankNumber: u8) {
    this.prgBankNumber = prgBankNumber
    this.chrBankNumber = chrBankNumber
  }

  cpuMapRead(address: u16): MappingResult {
    return { status: false, mappedAddress: 0 }
  }

  cpuMapWrite(address: u16): MappingResult {
    return { status: false, mappedAddress: 0 }
  }

  ppuMapRead(address: u16): MappingResult {
    return { status: false, mappedAddress: 0 }
  }

  ppuMapWrite(address: u16): MappingResult {
    return { status: false, mappedAddress: 0 }
  }
}

export class Mapper000 extends Mapper {
  cpuMapRead(address: u16): MappingResult {
    const isWithinRange = address >= 0x8000 && address <= 0xffff

    if (isWithinRange)
      return {
        status: isWithinRange,
        mappedAddress: address & (this.prgBankNumber > 1 ? 0x7fff : 0x3fff)
      }

    return { status: false, mappedAddress: address }
  }

  cpuMapWrite(address: u16): MappingResult {
    const isWithinRange = address >= 0x8000 && address <= 0xffff

    if (isWithinRange)
      return {
        status: isWithinRange,
        mappedAddress: address & (this.prgBankNumber > 1 ? 0x7fff : 0x3fff)
      }

    return { status: false, mappedAddress: address }
  }

  ppuMapRead(address: u16): MappingResult {
    const isWithinRange = address >= 0x0000 && address <= 0x1fff

    return {
      status: isWithinRange,
      mappedAddress: address
    }
  }
}
