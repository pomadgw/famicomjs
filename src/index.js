import 'regenerator-runtime/runtime'

import wasmloader from '@assemblyscript/loader' // or require
import App from './ui/App.svelte'

let app

wasmloader.instantiate(fetch('/wasm/nes.wasm')).then((module) => {
  console.log(module.exports)
  const nesPtr = module.exports.createNES()
  const nes = module.exports.NES.wrap(nesPtr)
  const cpu = module.exports.CPU.wrap(nes.cpu)
  console.log(cpu.A)
  console.log(cpu.X)
  console.log(cpu.Y)
  console.log(nes)
  window.NES = module.exports

  app = new App({
    target: document.body
  })
})

// export default app

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    app.$destroy()
  })
}
