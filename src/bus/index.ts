export default class Bus {
  public ram: Uint8Array

  constructor(ramSize = 0x10000) {
    this.ram = new Uint8Array(ramSize)
  }

  readRAM(address: number) {
    if (address >= this.ram.length) return 0

    return this.ram[address]
  }

  writeRAM(address: number, value: number) {
    if (address >= this.ram.length) return

    this.ram[address] = value & 0xff
  }

  read(address: number) {
    return this.readRAM(address)
  }

  write(address: number, value: number) {
    return this.writeRAM(address, value)
  }
}
