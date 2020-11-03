import Controller from '../controllers'

export default class Bus {
  constructor(cpu, ppu, { onRender } = {}) {
    this.cpu = cpu
    this.ppu = ppu

    this.cpu.connect(this)

    this.initVRAM()

    this.globalSystemClockNumber = 0

    this._on = {}
    this._on.render = onRender

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

  initVRAM() {
    const cpuRAM = new Uint8Array(0x10000)
    const thisBus = this
    cpuRAM.isReadOnly = false

    const proxyRAM = new Proxy(cpuRAM, {
      get: (target, prop) => {
        const isPropSymbol = typeof prop === 'symbol'
        const address = isPropSymbol ? prop : Number(prop)
        if (isPropSymbol || isNaN(address)) {
          if (typeof target[prop] === 'function') {
            return target[prop].bind(target)
          }

          return target[prop]
        }

        const checkFromCartridge = thisBus.cartridge?.cpuRead(address)
        if (checkFromCartridge !== null) return checkFromCartridge
        else if (address < 0x2000) return target[address & 0x07ff]
        else if (address < 0x4000)
          return this.ppu.cpuRead(address & 0x0007, target.isReadOnly)
        else if (address === 0x4016 || address === 0x4017) {
          return this.controllers[address & 0x1].read()
        }
        return 0
      },
      set: (target, prop, value) => {
        const isPropSymbol = typeof prop === 'symbol'
        const address = isPropSymbol ? prop : Number(prop)
        if (isPropSymbol || isNaN(address)) target[prop] = value
        else if (thisBus.cartridge?.cpuWrite(address, value)) return true
        else if (address < 0x2000) target[prop & 0x07ff] = value
        else if (address < 0x4000) {
          this.ppu.cpuWrite(address & 0x0007, value)
        } else if (address === 0x4016 || address === 0x4017) {
          this.controllers[address & 0x1].write(value)
        }

        return true
      }
    })

    this.cpu.ram = proxyRAM
    this.ram = proxyRAM
  }

  getRAMSnapshot() {
    const cpuRAM = new Uint8Array(0x10000)
    const oldFlagValue = this.ram.isReadOnly
    this.ram.isReadOnly = true

    for (let i = 0x0000; i < 0x10000; i++) {
      cpuRAM[i] = this.ram[i]
    }
    this.ram.isReadOnly = oldFlagValue

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
      this.cpu.atomicClock()
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
