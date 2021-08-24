import './style.css'

import { createApp } from 'vue'
import App from './App.vue'

// createApp(App).mount('#app')
import wasm, { NES } from '../nes/pkg/nes'

let audioContext: AudioContext | null = null

async function createMyAudioProcessor() {
  if (!audioContext) {
    try {
      audioContext = new AudioContext()
      await audioContext.resume()
      await audioContext.audioWorklet.addModule("/src/audio.js")
    } catch(e) {
      return null
    }
  }

  return new AudioWorkletNode(audioContext, "nes-audio")
}

document.querySelector('#test')?.addEventListener('click', async () => {
  const processor = await createMyAudioProcessor()

  let sab: SharedArrayBuffer

  if (audioContext && processor) {
    processor.connect(audioContext.destination)
    sab = new SharedArrayBuffer(256 * 240 * 4)

    processor.port.postMessage({ event: 'sab', value: sab })
    await fetch('/nes/pkg/nes_bg.wasm')
      .then(r => r.arrayBuffer())
      .then((buffer) => {
        processor.port.postMessage({
          event: 'wasm',
          value: buffer,
        })
      })

    await
      fetch('/nestest.nes')
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
            processor.port.postMessage({
              event: 'nes',
              value: buffer,
            })
            processor.port.postMessage({ event: 'set_sr', value: audioContext?.sampleRate })
          })
  }

  const ctx = document.querySelector('canvas')?.getContext('2d')

  if (ctx) {
    ctx.imageSmoothingEnabled = false

    // processor.port.onmessage = (e) => {
    //   const { event, value } = e.data
    //   // console.log(event)

    //   if (event === 'render_image') {
    //     const sabUint8 = new Uint8Array(sab)

    //     const imageData = ctx.createImageData(
    //       256,
    //       240
    //     )

    //     for (let i = 0; i < 256 * 240 * 4; i++) {
    //       imageData.data[i] = sabUint8[i]
    //     }

    //     ctx.putImageData(imageData, 0, 0)
    //   }
    // }

    const step: FrameRequestCallback = (
      timestamp: DOMHighResTimeStamp
    ) => {
      if (ctx && sab) {
        const sabUint8 = new Uint8Array(sab)
        const imageData = ctx.createImageData(
          256,
          240
        )

        // console.log(sabUint8)

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
