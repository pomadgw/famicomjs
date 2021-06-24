// import { createApp } from 'vue'
// import App from './App.vue'

import wasm, { NES } from '../nes/pkg/nes'

// createApp(App).mount('#app')

wasm().then((e) => {
  const nes = NES.new()
  nes.write(0xfffc, 0x00)
  nes.write(0xfffd, 0x80)
  console.log(nes.read(0xfffc))
  console.log(nes.read(0xfffd))
  nes.reset()

  nes.write(0x8000, 0xa9)
  nes.write(0x8001, 0x10)
  nes.write(0x8002, 0xaa)

  const clock = () => {
    nes.clock()
    while (!nes.is_cpu_done()) {
      nes.clock()
    }
    console.log(nes.debug())
  }

  clock()
  clock()
  clock()

  console.log(e.get_nes_screen_buffer_pointer())
})
