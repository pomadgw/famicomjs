import './url'
import './textdecoder'
import wasm, { NES } from '../nes/pkg/nes'

import { EVENT_TYPE } from './worker-constants'
import { NESStatus } from './utils'

let isWasmLoaded = false

class NesAudio extends AudioWorkletProcessor {
  constructor() {
    super()

    this.start = Date.now()
    this.buffer = []

    this.port.onmessage = (e) => {
      const { event, value } = e.data

      switch (event) {
        case EVENT_TYPE.TRANSFER_SAB:
          this.sab = value
          break
        case EVENT_TYPE.TRANSFER_SAB_CONTROLLER:
          this.sab_controller = new NESStatus(value)
          break
        case EVENT_TYPE.LOAD_ROM:
          if (isWasmLoaded) {
            const buffer = value
            const view = new Uint8Array(buffer)

            if (this.nes) {
              this.nes.set_pause(true)
              this.nes.replace_cartridge(view)
            } else {
              this.nes = NES.new(view)
            }

            this.nes.reset()
            this.nes.set_pause(false)
          }
          break
        case EVENT_TYPE.SET_SAMPLE_RATE:
          if (this.nes) {
            this.nes.set_sample_rate(value)
          }
          break
        case EVENT_TYPE.LOAD_WASM:
          this.loadWasm(value)
          break
        case EVENT_TYPE.RESUME:
          if (this.nes) {
            this.nes.set_pause(false)
          }
          break
        case EVENT_TYPE.PAUSE:
          if (this.nes) {
            this.nes.set_pause(true)
          }
          break
        case EVENT_TYPE.RESET:
          if (this.nes) {
            this.nes.reset()
          }
          break
      }
    }
  }

  loadWasm(buffer) {
    wasm(buffer).then((wasmObject) => {
      isWasmLoaded = true
      this.wasmObject = wasmObject
      this.wasmMemory = new Uint8Array(wasmObject.memory.buffer)
    })
  }

  process(inputList, outputs) {
    if (this.sab_controller.paused) {
      return true
    }

    /* using the inputs (or not, as needed), write the output
       into each of the outputs */
    if (this.nes && this.wasmMemory) {
      if (this.sab_controller.checkButton()) {
        if (this.sab_controller.isKeyDown()) {
          this.nes.press_button(0, this.sab_controller.pressedButton, false)
        } else {
          this.nes.press_button(0, this.sab_controller.pressedButton, true)
        }
      }

      if (this.sab_controller.ok && this.sab_controller.reset()) {
        this.nes.reset()
      }

      if (!this.audioview || this.pos >= this.audioview.length) {
        this.nes.clock_until_audio_ready_2()
        const pointer = this.nes.get_audio_buffer_pointer()
        const len = this.nes.get_audio_buffer_len()
        this.pos = 0
        this.audioview = new Float32Array(
          this.wasmObject.memory.buffer,
          pointer,
          len
        )
      }

      const output = outputs[0]

      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i++) {
          channel[i] = this.audioview[this.pos]
          this.pos += 1
        }
      })

      const pointer = this.nes.get_screen_buffer_pointer()
      const len = this.nes.get_screen_buffer_len()
      this.wasmMemory = new Uint8Array(
        this.wasmObject.memory.buffer,
        pointer,
        len
      )
      const view = new Uint8Array(this.sab)
      view.set(this.wasmMemory)
    }

    return true
  }
}

registerProcessor('nes-audio', NesAudio)
