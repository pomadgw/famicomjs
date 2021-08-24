import { Option, createSome, createNone } from 'option-t/lib/PlainOption'
import { NESStatus } from './utils'

import { EVENT_TYPE } from './worker-constants'

import audioUrl from '../audio.esm?url'
import nesWasmURL from '../nes/pkg/nes_bg.wasm?url'

const A = 1 << 0
const B = 1 << 1
const SELECT = 1 << 2
const START = 1 << 3
const UP = 1 << 4
const DOWN = 1 << 5
const LEFT = 1 << 6
const RIGHT = 1 << 7

export interface IButtons {
  [key: string]: number
}

export const Buttons: IButtons = {
  A,
  B,
  SELECT,
  START,
  UP,
  DOWN,
  LEFT,
  RIGHT
}

export default class NESRunner {
  private processor: Option<AudioWorkletNode>
  private sabScreenMemory: Option<SharedArrayBuffer>
  private sabController: Option<NESStatus>
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
    } else {
      this.sabScreenMemory = createSome(new SharedArrayBuffer(256 * 240 * 4))
      this.sabController = createSome(new NESStatus(new SharedArrayBuffer(16)))
      this.isDoneInitialize = Promise.resolve(false)
    }
  }

  initializeAudioContext() {
    const createMyAudioProcessor = async () => {
      if (!this.audioContext.ok) {
        try {
          this.audioContext = createSome(new AudioContext())
          await this.audioContext.val.resume()
          await this.audioContext.val.audioWorklet.addModule(audioUrl)
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
          value: this.sabController.val?.sab
        })

        return fetch(nesWasmURL)
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

    return this.isDoneInitialize
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

  reset() {
    this.postMessageToWorker({
      event: EVENT_TYPE.RESET
    })
  }

  pause() {
    if (this.sabController.ok) {
      this.sabController.val.paused = true
    }
  }

  resume() {
    if (this.sabController.ok) {
      this.sabController.val.paused = false
    }
  }

  keyDownButton(button: number) {
    if (this.processor.ok && this.sabController.ok) {
      this.sabController.val.keyDownButton(button)
    }
  }

  keyUpButton(button: number) {
    if (this.processor.ok && this.sabController.ok) {
      this.sabController.val.keyUpButton(button)
    }
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
