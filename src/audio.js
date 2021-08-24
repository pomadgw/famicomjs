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
      if (this.buffer.length === 0) {
        console.time('audio buffer')
        for (let i = 0; i < 44100 * 10; i++) {
          const audio = this.nes.clock_until_audio_ready()
          this.buffer.push(audio)
        }
        console.timeEnd('audio buffer')
      }
      // console.log(this.nes.cpu_total_cycles())
      // console.log(audio)

      const output = outputs[0]
      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i++) {
          channel[i] = this.buffer.shift()// + ((Math.random() * 2 - 1) * 0.005)
        }
      })

      // if (this.nes.done_drawing()) {
      //   const pointer = this.nes.get_screen_buffer_pointer()
      //   const len = this.nes.get_screen_buffer_len()
      //   this.wasmMemory = new Uint8Array(
      //     this.wasmObject.memory.buffer,
      //     pointer,
      //     len
      //   )
      //   const view = new Uint8Array(this.sab)

      //   for (let i = 0; i < this.wasmMemory.length; i++) {
      //     // this.sab[i] = this.wasmMemory[i]
      //     Atomics.store(view, i, this.wasmMemory[i])
      //   }
      // }
    }

    return true
  }
}

registerProcessor('nes-audio', NesAudio)
