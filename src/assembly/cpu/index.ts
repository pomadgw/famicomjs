import Bus from '../bus'
import RegisterStatus from './register'

export default class CPU {
  private bus: Bus
  public A: u8
  public X: u8
  public Y: u8
  public STATUS: RegisterStatus
  public SP: u8
  public PC: u16
  public absoluteAddress: u16
  public clocks: usize

  public fetchedData: u8

  constructor(bus: Bus) {
    this.bus = bus
    this.STATUS = new RegisterStatus(0)

    this.reset()

    this.absoluteAddress = 0
    this.clocks = 0
  }

  reset() : void {
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

  absMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const absoluteAddress = ((hi << 8) | lo)

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
}
