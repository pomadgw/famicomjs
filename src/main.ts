// import { createApp } from 'vue'
// import App from './App.vue'

import wasm, { NES } from '../nes/pkg/nes'

// createApp(App).mount('#app')

wasm().then((e) => {
  const nes = NES.new()
  nes.write(0xfffc, 0x12)
  nes.write(0xfffd, 0x34)
  console.log(nes.read(0xfffc))
  console.log(nes.read(0xfffd))
  nes.reset()

  nes.clock()
  while (!nes.is_cpu_done()) {
    nes.clock()
  }
  console.log(e.get_nes_screen_buffer_pointer())
  console.log(nes.debug())
})
