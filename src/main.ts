// import { createApp } from 'vue'
// import App from './App.vue'

import Bus from './bus'
import CPU from './cpu'
import wasm from '../nes/pkg/nes'

// createApp(App).mount('#app')

const bus = new Bus()
const cpu = new CPU()

cpu.reset()

cpu.clock(bus)
wasm().then((e) => {
  console.log(e)
})
