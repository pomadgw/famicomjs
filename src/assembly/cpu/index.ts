import Bus from '../bus'
import RegisterStatus from './register'
import { Flags } from './flags'

export default class CPU {
  private bus: Bus
  public A: u8
  public X: u8
  public Y: u8
  public STATUS: RegisterStatus
  public SP: u8
  public PC: u16
  public absoluteAddress: u16
  public relativeAddress: i16
  public clocks: usize

  public fetchedData: u8

  constructor(bus: Bus) {
    this.bus = bus
    this.STATUS = new RegisterStatus(0)

    this.reset()

    this.absoluteAddress = 0
    this.relativeAddress = 0
    this.clocks = 0
  }

  reset(): void {
    this.A = 0
    this.X = 0
    this.Y = 0
    this.SP = 0xfd
    this.PC = 0
    this.fetchedData = 0
    this.STATUS = new RegisterStatus(0x24)
  }

  read(address: u16): u8 {
    return this.bus.cpuRead(address)
  }

  nextPC(): u16 {
    return this.PC++
  }

  // eslint-disable-next-line
  fetch(): void {}

  // #region ADDRESSING MODES
  absMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const absoluteAddress = (hi << 8) | lo

    this.absoluteAddress = absoluteAddress
    this.clocks += 0
  }

  abxMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const offset = this.X
    const absoluteAddress = ((hi << 8) | lo) + offset

    this.absoluteAddress = absoluteAddress
    this.clocks += (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }

  abyMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const offset = this.Y
    const absoluteAddress = ((hi << 8) | lo) + offset

    this.absoluteAddress = absoluteAddress
    this.clocks += (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }

  immMode(): void {
    this.absoluteAddress = this.nextPC()
  }

  impMode(): void {
    this.fetchedData = this.A
  }

  zp0Mode(): void {
    const address = this.read(this.nextPC())

    this.absoluteAddress = address
  }

  zpxMode(): void {
    const address = this.read(this.nextPC())

    this.absoluteAddress = (address + this.X) & 0xff
  }

  zpyMode(): void {
    const address = this.read(this.nextPC())

    this.absoluteAddress = (address + this.Y) & 0xff
  }

  rel(): void {
    let offset: i16 = this.read(this.nextPC())

    if (offset > 0x7f) offset -= 0x100 as i16

    this.relativeAddress = offset
  }

  ind(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const pointer: u16 = (hi << 8) | lo

    const actualLo = this.read(pointer)

    const pointerHi: u16 = lo === 0xff ? pointer & 0xff00 : pointer + 1
    const actualHi = this.read(pointerHi)

    this.absoluteAddress = (actualHi << 8) | actualLo
  }

  inxMode(): void {
    const tableAddress = this.read(this.nextPC())
    const lo: u16 = this.read((tableAddress + this.X) & 0xff)
    const hi: u16 = this.read((tableAddress + this.X + 1) & 0xff)

    this.absoluteAddress = (hi << 8) | lo
  }

  inyMode(): void {
    const tableAddress = this.read(this.nextPC())

    const lo: u16 = this.read(tableAddress & 0xff)
    const hi: u16 = this.read((tableAddress + 1) & 0xff)

    this.absoluteAddress = (((hi << 8) | lo) + this.Y) & 0xffff

    this.clocks += (this.absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }
  // #endregion

  // #region OPERATORS
  // #region Clear Status

  CLC(): void {
    this.STATUS.setStatus(Flags.C, false)
  }

  CLD(): void {
    this.STATUS.setStatus(Flags.D, false)
  }

  CLI(): void {
    this.STATUS.setStatus(Flags.I, false)
  }

  CLV(): void {
    this.STATUS.setStatus(Flags.V, false)
  }

  // #endregion

  // #region Set Status

  SEC(): void {
    this.STATUS.setStatus(Flags.C, true)
  }

  SED(): void {
    this.STATUS.setStatus(Flags.D, true)
  }

  SEI(): void {
    this.STATUS.setStatus(Flags.I, true)
  }

  // #endregion

  // #endregion
}
