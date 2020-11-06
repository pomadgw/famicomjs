import Bus from '../bus'

export default class CPU {
  private bus: Bus
  public A: u8
  public X: u8
  public Y: u8
  public STATUS: u8
  public SP: u8
  public PC: u16

  constructor(bus: Bus) {
    this.bus = bus
    this.reset()
  }

  reset() : void {
    this.A = 0
    this.X = 0
    this.Y = 0
    this.SP = 0xfd
    this.PC = 0
    this.STATUS = 0x24
  }
}
