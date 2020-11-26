import Cartridge from '../cartridge'
import Controller from '../controllers'
import CPU from '../6502'
import PPU from '../ppu'
import APU, { OnAudioReady } from '../apu'

type RenderFn = (imageData: ImageData) => void

export default class Bus {
  public cartridge: Cartridge | null
  public cpu: CPU
  public ppu: PPU
  public apu: APU
  public ram: Uint8Array
  public isReadOnly: boolean
  public controllers: Controller[]
  public globalSystemClockNumber: number
  public _on: {
    render?: RenderFn
  }

  public dmaPage: number
  public dmaAddress: number
  public dmaData: number
  public isInDMATransfer: boolean
  private dmaDummy: boolean

  constructor(cpu: CPU, ppu: PPU, onRender?: RenderFn, onAudioReady?: OnAudioReady) {
    this.cpu = cpu
    this.ppu = ppu
    this.apu = new APU(44100, onAudioReady)

    this.cpu.connect(this)

    this.ram = new Uint8Array(0x2000)

    this.globalSystemClockNumber = 0

    this.dmaPage = 0x00
    this.dmaAddress = 0x00
    this.dmaData = 0x00
    this.isInDMATransfer = false
    this.dmaDummy = true

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
    this.cartridge = null
  }

  toJSON() {
    return {
      ram: [...this.ram],
      cpu: this.cpu,
      ppu: this.ppu,
      cartridge: this.cartridge
    }
  }

  loadState(state: any) {
    this.ram = new Uint8Array(state.ram)
    this.cpu.loadState(state.cpu)
    this.ppu.loadState(state.ppu)
    if (this.cartridge && state.cartridge) this.cartridge.loadState(state.cartridge)
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
    } else if (address === 0x4014) {
      // DMA stuffs happen here
      this.dmaPage = value
      this.dmaAddress = 0x00
      this.isInDMATransfer = true
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

  insertCartridge(cartridge: Cartridge) {
    this.cartridge = cartridge
    this.ppu.insertCartridge(cartridge)
  }

  reset() {
    this.ram = new Uint8Array(0x2000)
    this.cpu.reset()
    this.ppu.reset()
    this.cartridge?.reset()
    this.globalSystemClockNumber = 0

    this.dmaPage = 0x00
    this.dmaAddress = 0x00
    this.dmaData = 0x00
    this.isInDMATransfer = false
    this.dmaDummy = true
  }

  clock() {
    if (this.globalSystemClockNumber % 3 === 0) {
      if (this.isInDMATransfer) {
        // do something
        if (this.dmaDummy) {
          if (this.globalSystemClockNumber % 2 === 1) {
            this.dmaDummy = false
          }
        } else {
          if (this.globalSystemClockNumber % 2 === 0) {
            // read from cpu
            this.dmaData = this.cpuRead(this.dmaPage << 8 | this.dmaAddress)
          } else {
            this.ppu.writeToOAM(this.dmaAddress, this.dmaData)
            this.dmaAddress++
            this.dmaAddress &= 0xff
            if (this.dmaAddress === 0) {
              this.isInDMATransfer = false
              this.dmaDummy = true
            }
          }
        }
      } else {
        this.cpu.clock()
      }
    }

    this.ppu.clock()
    this.apu.clock()

    if (this.ppu.nmi) {
      this.ppu.nmi = false
      this.cpu.nmi()
    }

    this.globalSystemClockNumber += 1

    if (this.ppu.isFrameComplete) {
      const { imageData } = this.ppu.getScreen()
      if (this._on.render && imageData)
        this._on.render(imageData)
    }
  }
}
