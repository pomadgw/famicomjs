// import { createApp } from 'vue'
// import App from './App.vue'

import wasm, { CPU } from '../nes/pkg/nes'

// createApp(App).mount('#app')

wasm().then((e) => {
  const cpu = CPU.new()
  console.log(cpu.P)
})
