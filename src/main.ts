import './style.css'

// import { createApp } from 'vue'
// import App from './App.vue'

// createApp(App).mount('#app')
// import wasm, { NES } from '../nes/pkg/nes'

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

let audioContext: AudioContext | null = null

async function createMyAudioProcessor() {
  if (!audioContext) {
    try {
      audioContext = new AudioContext()
      await audioContext.resume()
      await audioContext.audioWorklet.addModule('/src/audio.js')
    } catch (e) {
      return null
    }
  }

  return new AudioWorkletNode(audioContext, 'nes-audio')
}

document.querySelector('#test')?.addEventListener('click', async () => {
  const processor = await createMyAudioProcessor()

  let sab: SharedArrayBuffer
  let sabController: SharedArrayBuffer

  if (audioContext && processor) {
    processor.connect(audioContext.destination)
    sab = new SharedArrayBuffer(256 * 240 * 4)
    sabController = new SharedArrayBuffer(3)

    processor.port.postMessage({ event: 'sab', value: sab })
    processor.port.postMessage({ event: 'sabController', value: sabController })
    await fetch('/nes/pkg/nes_bg.wasm')
      .then((r) => r.arrayBuffer())
      .then((buffer) => {
        processor.port.postMessage({
          event: 'wasm',
          value: buffer
        })
      })

    await fetch('/bad_apple.nes')
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        processor.port.postMessage({
          event: 'nes',
          value: buffer
        })
        processor.port.postMessage({
          event: 'set_sr',
          value: audioContext?.sampleRate
        })
      })
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyA') {
      keyDownButton(A)
    } else if (e.code === 'KeyS') {
      keyDownButton(B)
    } else if (e.code === 'KeyZ') {
      keyDownButton(START)
    } else if (e.code === 'KeyX') {
      keyDownButton(SELECT)
    } else if (e.code.substr(0, 5) === 'Arrow') {
      keyDownButton(Buttons[e.code.substr(5).toUpperCase()])
    }
  })

  document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyA') {
      keyUpButton(A)
    } else if (e.code === 'KeyS') {
      keyUpButton(B)
    } else if (e.code === 'KeyZ') {
      keyUpButton(START)
    } else if (e.code === 'KeyX') {
      keyUpButton(SELECT)
    } else if (e.code.substr(0, 5) === 'Arrow') {
      keyUpButton(Buttons[e.code.substr(5).toUpperCase()])
    }
  })

  const keyDownButton = (button: number) => {
    if (processor) {
      const sabControllerByte = new Uint8Array(sabController)
      // processor.press_button(0, button, true)
      sabControllerByte[0] = 1
      sabControllerByte[1] = 1
      sabControllerByte[2] = button
    }
  }

  const keyUpButton = (button: number) => {
    if (processor) {
      const sabControllerByte = new Uint8Array(sabController)
      // processor.press_button(0, button, false)
      sabControllerByte[0] = 1
      sabControllerByte[1] = 0
      sabControllerByte[2] = button
    }
  }

  const ctx = document.querySelector('canvas')?.getContext('2d')

  if (ctx) {
    ctx.imageSmoothingEnabled = false
    const step: FrameRequestCallback = (timestamp: DOMHighResTimeStamp) => {
      if (ctx && sab) {
        const sabUint8 = new Uint8Array(sab)
        const imageData = ctx.createImageData(256, 240)

        for (let i = 0; i < 256 * 240 * 4; i += 1) {
          imageData.data[i] = Atomics.load(sabUint8, i)
        }

        ctx.putImageData(imageData, 0, 0)
      }

      requestAnimationFrame(step)
    }

    step(0)
  }
})
