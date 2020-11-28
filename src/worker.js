import 'regenerator-runtime/runtime'
import Cartridge from './cartridge'
import Bus from './bus'
import CPU from './6502'
import PPU from './ppu'

const nes = new Bus(new CPU(), new PPU(), (imageData) => {
  self.postMessage({
    type: 'rendered',
    value: imageData
  })
})

let run = false

function requestFrame() {
  do {
    nes.clock()
  } while (!nes.ppu.isFrameComplete)

  nes.ppu.isFrameComplete = false
}

function loop() {
  // eslint-disable-next-line no-unmodified-loop-condition
  if (run) {
    do {
      nes.clock()
    } while (!nes.ppu.isFrameComplete)

    nes.ppu.isFrameComplete = false
  }
}

onmessage = async (e) => {
  // console.log('received message', e.data)
  const { type, value } = e.data

  if (type === 'setControllerArray') {
    const sview = new Uint8Array(value)
    nes.controllers[0]._buttonStatus = sview
    console.log(nes.controllers[0])
  } else if (type === 'setCart') {
    const cart = new Cartridge()

    await cart.parse(value)
    nes.insertCartridge(cart)
    nes.reset()
  } else if (type === 'toggleRun') {
    run = !run
    self.postMessage({
      type: 'toggleRun',
      value: run
    })

    if (run) loop()
  } else if (type === 'requestFrame') {
    requestFrame()
  } else if (type === 'keydown') {
    console.log({ type, value })

    nes.controllers[0].setButtonState(value, true)
    // requestFrame()
  } else if (type === 'keyup') {
    nes.controllers[0].setButtonState(value, false)
    // requestFrame()
  }
}
