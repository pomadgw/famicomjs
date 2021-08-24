import './url'
import './textdecoder'
import wasm, { NES } from '../nes/pkg/nes'

let isWasmLoaded = false

class NesAudio extends AudioWorkletProcessor {
  constructor() {
    super()

    this.start = Date.now()
    this.buffer = []

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
      }

      if (isWasmLoaded && this.nes && e.data.event === 'set_sr') {
        const sampleRate = e.data.value
        this.nes.set_sample_rate(sampleRate)
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
