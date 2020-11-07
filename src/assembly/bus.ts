import CPU from './cpu'

export default class Bus {
  public cpu: CPU | null
  public ram: Uint8Array

  constructor() {
    this.cpu = null
    this.ram = new Uint8Array(0x10000)
  }

  cpuRead(address: u16): u8 {
    return this.ram[address]
  }
}
