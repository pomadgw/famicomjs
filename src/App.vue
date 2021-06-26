<template>
  <div>
    <canvas ref="canvas" width="256" height="240" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import wasm, { NES } from '../nes/pkg/nes'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      canvas: null,
    }
  },
  mounted() {
    wasm().then((wasmObject) => {
      fetch('/nestest.nes')
        .then((response) => response.arrayBuffer())
        .then((buffer) => {
          const view = new Uint8Array(buffer)
          const nes = NES.new(view)
          nes.reset()
          // nes.toggle_debug()

          const clock = () => {
            nes.clock()
            while (!nes.is_cpu_done()) {
              nes.clock()
            }
            // console.log(nes.debug())
          }

          clock()
          nes.change_pc(0xc000)

          const wasmMemory = new Uint8Array(wasmObject.memory.buffer)
          const nesScreenPointer = nes.get_screen_buffer_pointer()
          console.log(wasmMemory[nesScreenPointer + 0])
          const ctx = document.querySelector('canvas')?.getContext('2d');

          ctx.imageSmoothingEnabled = false;
          ctx.mozImageSmoothingEnabled = false;
          ctx.webkitImageSmoothingEnabled = false;
          ctx.msImageSmoothingEnabled = false;

          let start: DOMHighResTimeStamp | undefined = undefined;

          const step: FrameRequestCallback = (timestamp: DOMHighResTimeStamp) => {
            // if (start === undefined) {
            //   start = timestamp
            // }
            // const elapsed = timestamp - start;

            // if (elapsed >= 17) {
            //   start = timestamp
              nes.clock_until_frame_done()

              if (ctx) {
                const imageData = ctx.createImageData(wasmObject.get_screen_width(), wasmObject.get_screen_height());

                for (let i = 0; i < imageData.data.length; i += 4) {
                  // Modify pixel data
                  imageData.data[i + 0] = wasmMemory[nesScreenPointer + i + 0]  // R value
                  imageData.data[i + 1] = wasmMemory[nesScreenPointer + i + 1]  // G value
                  imageData.data[i + 2] = wasmMemory[nesScreenPointer + i + 2]  // B value
                  imageData.data[i + 3] = wasmMemory[nesScreenPointer + i + 3]  // A value
                }

                ctx.putImageData(imageData, 0, 0);
              }

            // }

            requestAnimationFrame(step)
          }

          step()
        })
    })
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

canvas {
  width: 512px;
  image-rendering: pixelated;
}
</style>
