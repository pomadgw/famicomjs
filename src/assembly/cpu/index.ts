import Bus from '../bus'

export default class CPU {
  private bus: Bus
  public A: u8
  public X: u8
  public Y: u8
  public STATUS: u8
  public SP: u8
  public PC: u16
  public absoluteAddress: u16
  public clocks: usize

  constructor(bus: Bus) {
    this.bus = bus
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
    this.STATUS = 0x24
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

  absXMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const offset = this.X
    const absoluteAddress = ((hi << 8) | lo) + offset

    this.absoluteAddress = absoluteAddress
    this.clocks += (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }

  absYMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const offset = this.Y
    const absoluteAddress = ((hi << 8) | lo) + offset

    this.absoluteAddress = absoluteAddress
    this.clocks += (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }
}
