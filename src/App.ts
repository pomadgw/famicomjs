import { defineComponent } from 'vue'
import wasm, { NES } from '../nes/pkg/nes'

const A = 1 << 0
const B = 1 << 1
const SELECT = 1 << 2
const START = 1 << 3
const UP = 1 << 4
const DOWN = 1 << 5
const LEFT = 1 << 6
const RIGHT = 1 << 7

interface IButtons {
  [key: string]: number
}

const Buttons: IButtons = {
  A,
  B,
  SELECT,
  START,
  UP,
  DOWN,
  LEFT,
  RIGHT
}

interface Data {
  nes: NES | null
  Buttons: IButtons
}

export default defineComponent({
  name: 'App',
  data(): Data {
    return {
      nes: null,
      Buttons
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

          document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyA') {
              this.keyDownButton(A)
            } else if (e.code === 'KeyS') {
              this.keyDownButton(B)
            } else if (e.code === 'KeyZ') {
              this.keyDownButton(START)
            } else if (e.code === 'KeyX') {
              this.keyDownButton(SELECT)
            } else if (e.code.substr(0, 5) === 'Arrow') {
              this.keyDownButton(Buttons[e.code.substr(5).toUpperCase()])
            }
          })

          document.addEventListener('keyup', (e) => {
            if (e.code === 'KeyA') {
              this.keyUpButton(A)
            } else if (e.code === 'KeyS') {
              this.keyUpButton(B)
            } else if (e.code === 'KeyZ') {
              this.keyUpButton(START)
            } else if (e.code === 'KeyX') {
              this.keyUpButton(SELECT)
            } else if (e.code.substr(0, 5) === 'Arrow') {
              this.keyUpButton(Buttons[e.code.substr(5).toUpperCase()])
            }
          })

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
    },
    click(button: number) {
      if (this.nes) {
        this.keyDownButton(button)
        setTimeout(() => {
          this.keyUpButton(button)
        }, 10)
      }
    },
    keyDownButton(button: number) {
      if (this.nes) {
        this.nes.press_button(0, button, true)
      }
    },
    keyUpButton(button: number) {
      if (this.nes) {
        this.nes.press_button(0, button, false)
      }
    }
  }
})
