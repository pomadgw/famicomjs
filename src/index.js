import App from './ui/App.svelte'
import CPU from './6502/cpu'

const canvas = document.querySelector('#canvas')
const cpu = new CPU([...new Array(0x2000)].map((_) => 0))
console.log(canvas)
console.log(cpu)

var app = new App({
  target: document.body
})

export default app

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/#hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.dispose(() => {
    app.$destroy()
  })
}
