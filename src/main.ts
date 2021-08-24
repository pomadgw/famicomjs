import './style.css'

import { Option, createSome, createNone } from 'option-t/lib/PlainOption'

import { EVENT_TYPE } from './worker-constants'

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

class NESRunner {
  private processor: Option<AudioWorkletNode>
  private sabScreenMemory: Option<SharedArrayBuffer>
  private sabController: Option<SharedArrayBuffer>
  private audioContext: Option<AudioContext>
  private isWasmLoaded: boolean

  isDoneInitialize: Promise<boolean>

  constructor() {
    this.audioContext = createNone()
    this.sabScreenMemory = createNone()
    this.sabController = createNone()
    this.processor = createNone()
    this.isWasmLoaded = false

    if (!crossOriginIsolated) {
      console.error(
        'Cannot use SharedArrayBuffer; security requirement is not met!'
      )

      this.isDoneInitialize = Promise.resolve(false)

      return
    } else {
      this.sabScreenMemory = createSome(new SharedArrayBuffer(256 * 240 * 4))
      this.sabController = createSome(new SharedArrayBuffer(3))
    }

    const createMyAudioProcessor = async () => {
      if (!this.audioContext.ok) {
        try {
          this.audioContext = createSome(new AudioContext())
          await this.audioContext.val.resume()
          await this.audioContext.val.audioWorklet.addModule('/src/audio.js')
        } catch (e) {
          console.error(e)
          return createNone()
        }
      }

      return createSome(
        new AudioWorkletNode(this.audioContext.val, 'nes-audio')
      )
    }

    this.isDoneInitialize = createMyAudioProcessor().then((processor) => {
      if (this.audioContext.ok && processor.ok) {
        processor.val.connect(this.audioContext.val.destination)

        this.processor = processor

        processor.val.port.postMessage({
          event: EVENT_TYPE.TRANSFER_SAB,
          value: this.sabScreenMemory.val
        })
        processor.val.port.postMessage({
          event: EVENT_TYPE.TRANSFER_SAB_CONTROLLER,
          value: this.sabController.val
        })

        return fetch('/nes/pkg/nes_bg.wasm')
          .then((r) => r.arrayBuffer())
          .then((buffer) => {
            processor.val.port.postMessage({
              event: EVENT_TYPE.LOAD_WASM,
              value: buffer
            })

            this.isWasmLoaded = true

            return true
          })
      }

      return false
    })
  }

  loadROM(arrayBuffer: ArrayBuffer) {
    this.runIfWasmIfLoaded(() => {
      this.postMessageToWorker({
        event: EVENT_TYPE.LOAD_ROM,
        value: arrayBuffer
      })

      if (this.audioContext.ok) {
        this.postMessageToWorker({
          event: EVENT_TYPE.SET_SAMPLE_RATE,
          value: this.audioContext.val.sampleRate
        })
      }
    })
  }

  private postMessageToWorker(message: any) {
    if (this.processor.ok) {
      this.processor.val.port.postMessage(message)
    }
  }

  private runIfWasmIfLoaded(fn: () => void) {
    if (this.isWasmLoaded) {
      fn()
    }
  }

  installKeyboardEventListener() {
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
      if (this.processor.ok && this.sabController.ok) {
        const sabControllerByte = new Uint8Array(this.sabController.val)
        sabControllerByte[0] = 1
        sabControllerByte[1] = 1
        sabControllerByte[2] = button
      }
    }

    const keyUpButton = (button: number) => {
      if (this.processor.ok && this.sabController.ok) {
        const sabControllerByte = new Uint8Array(this.sabController.val)
        sabControllerByte[0] = 1
        sabControllerByte[1] = 0
        sabControllerByte[2] = button
      }
    }
  }

  renderImage(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false
    const step: FrameRequestCallback = () => {
      if (this.sabScreenMemory.ok) {
        const sabUint8 = new Uint8Array(this.sabScreenMemory.val)
        const imageData = ctx.createImageData(256, 240)

        for (let i = 0; i < 256 * 240 * 4; i += 1) {
          imageData.data[i] = Atomics.load(sabUint8, i)
        }

        ctx.putImageData(imageData, 0, 0)
        requestAnimationFrame(step)
      }
    }

    step(0)
  }
}

declare global {
  interface Window {
    nesRunner: NESRunner
  }
}

document.querySelector('#test')?.addEventListener('click', async () => {
  window.nesRunner = new NESRunner()

  await window.nesRunner.isDoneInitialize

  const ctx = document.querySelector('canvas')?.getContext('2d')

  const romBuffer = await fetch('/nestest.nes').then((response) =>
    response.arrayBuffer()
  )

  window.nesRunner.loadROM(romBuffer)
  window.nesRunner.installKeyboardEventListener()

  if (ctx && (await window.nesRunner.isDoneInitialize)) {
    window.nesRunner.renderImage(ctx)
  }
})
