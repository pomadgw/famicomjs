import cartridge from '../cartridge'
import Controller from '../controllers'
import CPU from '../6502'
import PPU from '../ppu'

type RenderFn = (imageData: ImageData) => void

export default class Bus {
  public cartridge: cartridge
  public cpu: CPU
  public ppu: PPU
  public ram: Uint8Array
  public isReadOnly: boolean
  public controllers: Controller[]
  public globalSystemClockNumber: number
  public _on: {
    render: RenderFn
  }

  constructor(cpu, ppu, onRender?: RenderFn) {
    this.cpu = cpu
    this.ppu = ppu

    this.cpu.connect(this)

    this.ram = new Uint8Array(0x2000)

    this.globalSystemClockNumber = 0

    this._on = {
      render: onRender
    }

    this.controllers = [
      new Controller({
        KeyA: 'A',
        KeyS: 'B',
        KeyZ: 'Select',
        KeyX: 'Start',
        ArrowUp: 'Up',
        ArrowDown: 'Down',
        ArrowLeft: 'Left',
        ArrowRight: 'Right'
      }),
      new Controller()
    ]

    this.isReadOnly = false
  }

  cpuRead(address: number): number {
    const checkFromCartridge = this.cartridge?.cpuRead(address)
    if (checkFromCartridge !== null) return checkFromCartridge
    else if (address < 0x2000) return this.ram[address & 0x07ff]
    else if (address < 0x4000)
      return this.ppu.cpuRead(address & 0x0007, this.isReadOnly)
    else if (address === 0x4016 || address === 0x4017) {
      return this.controllers[address & 0x1].read()
    }
    return 0
  }

  cpuWrite(address: number, value: number) {
    if (this.cartridge?.cpuWrite(address, value)) return true
    else if (address < 0x2000) this.ram[address & 0x07ff] = value
    else if (address < 0x4000) {
      this.ppu.cpuWrite(address & 0x0007, value)
    } else if (address === 0x4016 || address === 0x4017) {
      this.controllers[address & 0x1].write(value)
    }
  }

  getRAMSnapshot(start = 0x8000) {
    const cpuRAM = new Uint8Array(0x10000)
    const oldFlagValue = this.isReadOnly
    this.isReadOnly = true

    for (let i = start; i < 0x10000; i++) {
      cpuRAM[i] = this.cpuRead(i)
    }

    this.isReadOnly = oldFlagValue

    return cpuRAM
  }

  insertCartridge(cartridge) {
    this.cartridge = cartridge
    this.ppu.insertCartridge(cartridge)
  }

  reset() {
    this.cpu.reset()
    this.ppu.reset()
    this.globalSystemClockNumber = 0
  }

  clock() {
    if (this.globalSystemClockNumber % 3 === 0) {
      this.cpu.clock()
    }

    this.ppu.clock()

    if (this.ppu.nmi) {
      this.ppu.nmi = false
      this.cpu.nmi()
    }

    this.globalSystemClockNumber += 1

    if (this.ppu.isFrameComplete) {
      this._on.render(this.ppu.getScreen().imageData)
    }
  }
}
