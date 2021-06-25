// import { createApp } from 'vue'
// import App from './App.vue'

import wasm, { NES } from '../nes/pkg/nes'

// createApp(App).mount('#app')

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

      for (let i = 0; i < 1000; i++) clock()

      const wasmMemory = new Uint8Array(wasmObject.memory.buffer)
      const nesScreenPointer = nes.get_screen_buffer_pointer()
      console.log(wasmMemory[nesScreenPointer + 0])
    })
})
