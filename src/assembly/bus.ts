import CPU from './cpu'
import PPU from './ppu'
import Cartridge from './cartridge'
import Controller from './controller'

export default class Bus {
  public cpu: CPU | null
  public ram: Uint8Array

  constructor(size: i32) {
    this.cpu = null
    this.ram = new Uint8Array(size)
  }

  cpuRead(address: u16): u8 {
    return this.ram[address]
  }

  cpuWrite(address: u16, value: u8): void {
    this.ram[address] = value
  }
}

export class NES extends Bus {
  public ppu: PPU
  public globalSystemClockNumber: u32
  public cartridge: Cartridge
  public isReadOnly: bool
  public controllers: Controller[]

  constructor(cpu: CPU, ppu: PPU) {
    super(0x2000)

    this.cpu = cpu
    this.ppu = ppu
    this.globalSystemClockNumber = 0
    this.isReadOnly = false

    this.controllers = [new Controller(), new Controller()]
  }

  insertCartridge(cartridge: Cartridge): void {
    this.cartridge = cartridge
    this.ppu.insertCartridge(cartridge)
  }

  cpuRead(address: u16): u8 {
    const cartridge = this.cartridge
    if (!cartridge) return 0

    const checkFromCartridge = cartridge.cpuRead(address)
    if (!checkFromCartridge.error) return checkFromCartridge.value
    else if (address < 0x2000) return this.ram[address & 0x07ff]
    else if (address < 0x4000)
      return this.ppu.cpuRead(address & 0x0007, this.isReadOnly)
    else if (address === 0x4016 || address === 0x4017) {
      return this.controllers[address & 0x1].read()
    }
    return 0
  }

  cpuWrite(address: u16, value: u8): bool {
    const cartridge = this.cartridge
    if (!cartridge) return false

    const checkFromCartridge = cartridge.cpuWrite(address, value)
    if (!checkFromCartridge.error) return true
    else if (address < 0x2000) this.ram[address & 0x07ff] = value
    else if (address < 0x4000) {
      this.ppu.cpuWrite(address & 0x0007, value)
    } else if (address === 0x4016 || address === 0x4017) {
      this.controllers[address & 0x1].write(value)
    }
    return true
  }

  reset(): void {
    const cpu = this.cpu
    if (!cpu) return
    cpu.reset()
    this.ppu.reset()
    this.globalSystemClockNumber = 0
  }

  clock(): void {
    const cpu = this.cpu
    if (!cpu) return

    if (this.globalSystemClockNumber % 3 === 0) {
      cpu.clock()
    }

    this.ppu.clock()

    if (this.ppu.nmi) {
      this.ppu.nmi = false
      cpu.nmi()
    }

    this.globalSystemClockNumber += 1
  }
}
