import pick from 'lodash/pick'
import merge from 'lodash/merge'
import Mapper from './mapper'
import MirrorMode from '../ppu/mirror-mode'
import toHex from '../utils/tohex'
import * as myConsole from '../utils/debug'

const SERIALIZED_PROPS = [
  'shiftReg',
  'shiftTimer',
  'controlReg',
  'prgRom32kBankNumber',
  'prgRom16kLowBankNumber',
  'prgRom16kHighBankNumber',
  'chrRom8kBankNumber',
  'chrRom4k0BankNumber',
  'chrRom4k1BankNumber',
  'usePrgRam'
]
export default class MapperMMC1 extends Mapper {
  constructor(prgBankNumber, chrBankNumber) {
    super(prgBankNumber, chrBankNumber)

    this.ram = new Uint8Array(0x2000)
    this.ram[0x01] = 0x5a
    this.ram[0x1fff] = 0xa5

    this.shiftReg = 0
    this.shiftTimer = 0

    this.controlReg = 0x1c

    this.prgRom32kBankNumber = 0
    this.prgRom16kLowBankNumber = 0
    this.prgRom16kHighBankNumber = this.prgBankNumber - 1

    this.chrRom8kBankNumber = 0
    this.chrRom4k0BankNumber = 0
    this.chrRom4k1BankNumber = 0

    this.usePrgRam = false
  }

  reset() {
    this.shiftReg = 0
    this.shiftTimer = 0

    this.controlReg = 0x1c

    this.prgRom32kBankNumber = 0
    this.prgRom16kLowBankNumber = 0
    this.prgRom16kHighBankNumber = this.prgBankNumber - 1
    this.chrRom8kBankNumber = 0
    this.chrRom4k0BankNumber = 0
    this.chrRom4k1BankNumber = 0
  }

  toJSON() {
    return merge(
      {
        ram: [...this.ram]
      },
      pick(this, SERIALIZED_PROPS)
    )
  }

  loadState(state) {
    merge(this, pick(state, SERIALIZED_PROPS))
    this.ram = new Uint8Array(state.ram)
  }

  shift(address, data) {
    if ((data & 0x80) > 0) {
      this.shiftTimer = 0
      this.shiftReg = 0
      this.controlReg |= 0x0c
      return
    }

    let result = (data & 0x01) << 4
    result |= this.shiftReg >> 1
    this.shiftTimer++
    this.shiftReg = result

    if (this.shiftTimer === 5) {
      const target = (address >> 13) & 0x03
      myConsole.log(
        `mmc1: target: ${target}, value: ${toHex(this.shiftReg)} \n`
      )

      if (target === 0) {
        this.controlReg = this.shiftReg
      } else if (target === 1) {
        const use4KbCHRMode = (this.controlReg & 0b0001_0000) > 0

        if (use4KbCHRMode) {
          this.chrRom4k0BankNumber = this.shiftReg & 0x1f
        } else {
          this.chrRom8kBankNumber = (this.shiftReg & 0x1e) >> 1
        }
      } else if (target === 2) {
        const use4KbCHRMode = (this.controlReg & 0b0001_0000) > 0

        if (use4KbCHRMode) {
          this.chrRom4k1BankNumber = this.shiftReg & 0x1f
        }
      } else {
        // target === 3
        this.usePrgRam = (this.controlReg & 0b0001_0000) === 0
        const prgBankMode = (this.controlReg & 0b0000_1100) >> 2
        myConsole.log(`mmc1: prgBankMode: ${prgBankMode}\n`)

        if (prgBankMode === 0 || prgBankMode === 1) {
          this.prgRom32kBankNumber = (this.shiftReg & 0b0000_1110) >> 1
        } else if (prgBankMode === 2) {
          this.prgRom16kLowBankNumber = 0
          this.prgRom16kHighBankNumber = this.shiftReg & 0b0000_1111
          myConsole.log(
            `mmc1: prgRom16kLowBankNumber: ${this.prgRom16kLowBankNumber}\n`
          )
          myConsole.log(
            `mmc1: prgRom16kHighBankNumber: ${this.prgRom16kHighBankNumber}\n`
          )
        } else {
          this.prgRom16kLowBankNumber = this.shiftReg & 0b0000_1111
          this.prgRom16kHighBankNumber = this.prgBankNumber - 1
          myConsole.log(
            `mmc1: prgRom16kLowBankNumber: ${this.prgRom16kLowBankNumber}\n`
          )
          myConsole.log(
            `mmc1: prgRom16kHighBankNumber: ${this.prgRom16kHighBankNumber}\n`
          )
        }
      }

      this.shiftTimer = 0
      this.shiftReg = 0
    }
  }

  mirror() {
    const mode = this.controlReg & 0x03

    if (mode === 0) return MirrorMode.ONESCREEN_LO
    if (mode === 1) return MirrorMode.ONESCREEN_HI
    if (mode === 2) return MirrorMode.VERTICAL
    if (mode === 3) return MirrorMode.HORIZONTAL
    return null // reaching this is impossible, though
  }

  cpuMapRead(address) {
    if (this.usePrgRam && address >= 0x6000 && address < 0x8000) {
      const value = this.ram[address & 0x1fff]

      return { status: true, mappedAddress: address, value }
    }

    if (address >= 0x8000) {
      const use16Mode = (this.controlReg & 0b0000_1000) > 0
      let mappedAddress = 0

      if (use16Mode) {
        const newAddress = address & 0x3fff
        if (address < 0xc000) {
          mappedAddress = this.prgRom16kLowBankNumber * 0x4000 + newAddress
        } else {
          mappedAddress = this.prgRom16kHighBankNumber * 0x4000 + newAddress
        }
      } else {
        mappedAddress = this.prgRom32kBankNumber * 0x8000 + (address & 0x7fff)
      }

      return { status: true, mappedAddress }
    }

    return { status: false, mappedAddress: address }
  }

  cpuMapWrite(address, value) {
    if (this.usePrgRam && address >= 0x6000 && address < 0x8000) {
      this.ram[address & 0x1fff] = value

      return { status: true, mappedAddress: address, value: true }
    }

    if (address >= 0x8000) {
      this.shift(address, value)
    }

    return { status: false, mappedAddress: address }
  }

  ppuMapRead(address) {
    if (address >= 0x2000) return { status: false }

    let mappedAddress = address
    if (this.chrBankNumber === 0) {
      return { status: true, mappedAddress }
    }

    const use4kbCHRBankMode = (this.controlReg & 0b0001_0000) > 0

    if (use4kbCHRBankMode) {
      const newAddress = address & 0x0fff
      if (address < 0x1000) {
        mappedAddress = this.chrRom4k0BankNumber * 0x1000 + newAddress
      } else {
        mappedAddress = this.chrRom4k1BankNumber * 0x1000 + newAddress
      }
    } else {
      mappedAddress = this.chrRom8kBankNumber * 0x2000 + (address & 0x1fff)
    }

    return { status: true, mappedAddress }
  }

  ppuMapWrite(address, value) {
    if (address >= 0x2000) return { status: false }

    const mappedAddress = address

    if (this.chrBankNumber === 0) {
      return { status: true, mappedAddress, write: true }
    } else {
      return { status: true, mappedAddress }
    }
  }
}
