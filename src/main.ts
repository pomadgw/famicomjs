// import { createApp } from 'vue'
// import App from './App.vue'

import wasm, { NES } from '../nes/pkg/nes'

// createApp(App).mount('#app')

wasm().then((e) => {
  const nes = NES.new()
  nes.clock()
  console.log(e.get_nes_screen_buffer_pointer())
})
