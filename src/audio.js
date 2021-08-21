import './url'
import './textdecoder'
import wasm, { NES } from '../nes/pkg/nes'

let isWasmLoaded = false

class NesAudio extends AudioWorkletProcessor {
  constructor(x) {
    super()

    this.port.onmessage = (e) => {
      // console.log(e)
      if (e.data.event === 'sab') {
        this.sab = e.data.value
      }

      if (isWasmLoaded && e.data.event === 'nes') {
        const buffer = e.data.value
        const view = new Uint8Array(buffer)

        const nes = NES.new(view)
        this.nes = nes

        nes.reset()
        this.nes.set_pause(false)
        this.nes.toggle_debug()
      }

      if (e.data.event === 'wasm') {
        wasm(e.data.value).then((wasmObject) => {
          isWasmLoaded = true
          this.wasmObject = wasmObject
          console.log(wasmObject.memory)
          this.wasmMemory = new Uint8Array(wasmObject.memory.buffer)
          console.log(this.wasmMemory.length)
        })
      }
    }
  }

  process(inputList, outputs, parameters) {
    /* using the inputs (or not, as needed), write the output
       into each of the outputs */
    if (this.nes && this.wasmMemory) {
      const audio = this.nes.clock_until_audio_ready()
      const pointer = this.nes.get_screen_buffer_pointer()
      const len = this.nes.get_screen_buffer_len()
      this.wasmMemory = new Uint8Array(this.wasmObject.memory.buffer, pointer, len)

      for (let i = 0; i < this.wasmMemory.length; i++) {
        this.sab[i] = this.wasmMemory[i]
        console.log(this.sab[i])
      }

      const output = outputs[0]
      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i++) {
          channel[i] = audio
        }
      })
    }

    return true
  }
}

registerProcessor('nes-audio', NesAudio)
