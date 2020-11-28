import 'regenerator-runtime/runtime'
import Cartridge from './cartridge'
import Bus from './bus'
import CPU from './6502'
import PPU from './ppu'

class NESRunner extends AudioWorkletProcessor {
  constructor() {
    super()

    const nes = new Bus(new CPU(), new PPU(), (imageData) => {
      for (let i = 0; i < this.imageBufferAsU8.length; i++) {
        this.imageBufferAsU8[i] = imageData[i]
      }
      this.port.postMessage({
        type: 'rendered'
        // value: imageData
      })
    })

    this.nes = nes
    this.run = false
    this.imageBuffer = []
    this.imageBufferAsU8 = []

    this.port.onmessage = (e) => {
      // console.log('received message', e.data)
      const { type, value } = e.data

      if (type === 'setControllerArray') {
        const sview = new Uint8Array(value)
        nes.controllers[0]._buttonStatus = sview
        console.log(nes.controllers[0])
      } else if (type === 'setCart') {
        const cart = new Cartridge()

        cart.parse(value)
        nes.insertCartridge(cart)
        nes.reset()
      } else if (type === 'toggleRun') {
        this.run = !this.run
        console.log('run!', this.run)
        this.port.postMessage({
          type: 'toggleRun',
          value: this.run
        })
      } else if (type === 'reset') {
        nes.reset()
      } else if (type === 'setImageBuffer') {
        this.imageBuffer = value
        this.imageBufferAsU8 = new Uint8ClampedArray(this.imageBuffer)
      }
    }
  }

  process(inputs, outputs, parameters) {
    const output = outputs[0]
    if (this.run) {
      do {
        this.nes.clock()
      } while (!this.nes.apu.isAudioReady)
      // console.log('.')
      this.nes.apu.isAudioReady = false
    }
    output.forEach((channel) => {
      for (let i = 0; i < channel.length; i++) {
        channel[i] = this.run ? this.nes.apu.output : 0
        // channel[i] = this.run ? Math.random() * 2 - 1 : 0
        // console.log(this.run ? Math.random() * 2 - 1 : 0)
      }
    })
    return true
  }
}

registerProcessor('nes-runner', NESRunner)
