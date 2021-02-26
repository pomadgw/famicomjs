// import { createApp } from 'vue'
// import App from './App.vue'

import Bus from './bus'
import CPU from './cpu'

// createApp(App).mount('#app')

const bus = new Bus()
const cpu = new CPU()

cpu.reset()

cpu.clock(bus)
