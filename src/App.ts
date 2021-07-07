import { defineComponent } from 'vue'
import wasm, { NES } from '../nes/pkg/nes'

interface Data {
  nes: NES | null
}

export default defineComponent({
  name: 'App',
  data(): Data {
    return {
      nes: null
    }
  },
  mounted() {
    wasm().then((wasmObject) => {
      fetch('/nestest.nes')
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          const view = new Uint8Array(buffer)
          const nes: NES = NES.new(view)
          this.nes = nes
          nes.reset()

          const wasmMemory = new Uint8Array(wasmObject.memory.buffer)
          const nesScreenPointer = nes.get_screen_buffer_pointer()
          console.log(wasmMemory[nesScreenPointer + 0])
          const ctx = document.querySelector('canvas')?.getContext('2d')

          if (ctx) {
            ctx.imageSmoothingEnabled = false
          }

          const step: FrameRequestCallback = (
            timestamp: DOMHighResTimeStamp
          ) => {
            nes.clock_until_frame_done()

            if (ctx) {
              const imageData = ctx.createImageData(
                wasmObject.get_screen_width(),
                wasmObject.get_screen_height()
              )

              for (let i = 0; i < imageData.data.length; i += 4) {
                // Modify pixel data
                imageData.data[i + 0] = wasmMemory[nesScreenPointer + i + 0] // R value
                imageData.data[i + 1] = wasmMemory[nesScreenPointer + i + 1] // G value
                imageData.data[i + 2] = wasmMemory[nesScreenPointer + i + 2] // B value
                imageData.data[i + 3] = wasmMemory[nesScreenPointer + i + 3] // A value
              }

              ctx.putImageData(imageData, 0, 0)
            }
            requestAnimationFrame(step)
          }

          step(0)
        })
    })
  },
  methods: {
    resetNES() {
      if (this.nes) {
        this.nes.reset()
      }
    }
  }
})
