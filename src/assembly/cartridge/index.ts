import Result from '../utils/result'
import { Mapper, Mapper000 } from '../mappers'

export enum MirrorMode {
  HORIZONTAL,
  VERTICAL,
  ONESCREEN_LO,
  ONESCREEN_HI
}

export default class Cartridge {
  public mapperId: u8
  public prgBankNumber: u8
  public chrBankNumber: u8
  public mirrorMode: MirrorMode

  public prgMemory: Uint8Array
  public chrMemory: Uint8Array

  private romData: ArrayBuffer
  private mapper: Mapper

  constructor(romData: ArrayBuffer) {
    this.romData = romData
    this.mapperId = 0
    this.prgBankNumber = 0
    this.chrBankNumber = 0
    this.prgMemory = new Uint8Array(0)
    this.chrMemory = new Uint8Array(0)
    this.mirrorMode = MirrorMode.HORIZONTAL
    this.mapper = new Mapper(this.prgBankNumber, this.chrBankNumber)
  }

  parse(): Result<string, bool> {
    const view = Uint8Array.wrap(this.romData)
    const header = view.slice(0, 4)
    const compareHeader = [0x4e, 0x45, 0x53, 0x1a]

    for (let i = 0; i < header.length; i++) {
      if (compareHeader[i] !== header[i]) {
        return { value: 'not a NES file', error: true }
      }
    }

    const mapper1 = view[6]
    const mapper2 = view[7]

    this.mapperId = ((mapper2 >> 4) << 4) | (mapper1 >> 4)
    this.mirrorMode =
      (mapper1 & 0x01) > 0 ? MirrorMode.VERTICAL : MirrorMode.HORIZONTAL

    let seekPosition = 16

    if ((mapper1 & 0x04) > 0) {
      seekPosition += 512
    }

    // const nFileType = 1
    // if (nFileType === 0) {
    // } else if (nFileType === 1) {
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
    // } else if (nFileType === 2) {
    // }

    switch (this.mapperId) {
      case 0x00:
        this.mapper = new Mapper000(this.prgBankNumber, this.chrBankNumber)
        break
      default:
        this.mapper = new Mapper(this.prgBankNumber, this.chrBankNumber)
        break
    }

    return { value: 'OK', error: false }
  }

  cpuRead(address: u16): Result<u16, bool> {
    const result = this.mapper.cpuMapRead(address)

    if (result.status) {
      return {
        value: this.prgMemory[result.mappedAddress],
        error: false
      }
    }

    return { value: 0, error: true }
  }

  cpuWrite(address: u16, value: u8): Result<u16, bool> {
    const result = this.mapper.cpuMapWrite(address)

    if (result.status) {
      this.prgMemory[result.mappedAddress] = value
      return { value: 0, error: false }
    }

    return { value: 0, error: true }
  }

  ppuRead(address: u16): Result<u16, bool> {
    const result = this.mapper.ppuMapRead(address)

    if (result.status) {
      return {
        value: this.chrMemory[result.mappedAddress],
        error: false
      }
    }

    return { value: 0, error: true }
  }

  ppuWrite(address: u16, value: u8): Result<u16, bool> {
    const result = this.mapper.ppuMapWrite(address)

    if (result.status) {
      this.chrMemory[result.mappedAddress] = value
      return { value: 0, error: false }
    }

    return { value: 0, error: true }
  }
}
