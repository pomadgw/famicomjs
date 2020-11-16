import CPU from './index'

export default function createBus() {
  const bus = {
    ram: new Uint8Array(0x8000),
    cpuRead(addr) {
      return this.ram[addr]
    },
    cpuWrite(addr, value) {
      this.ram[addr] = value
    },
    cpu: new CPU()
  }

  bus.cpu.connect(bus)
  return bus
}
