import 'gamecontroller.js'
import Controller from './index'

export default () => {
  const controller = new Controller()

  const BUTTON_MAPS = {
    button12: 'Up',
    button15: 'Right',
    button13: 'Down',
    button14: 'Left',
    up: 'Up',
    right: 'Right',
    down: 'Down',
    left: 'Left',
    button0: 'A',
    button1: 'B',
    button2: 'Start',
    button3: 'Select'
  }

  window.gameControl.on('connect', (gamepad) => {
    console.log('gamepad connected:', gamepad)
    Object.entries(BUTTON_MAPS).forEach(([button, mappedButton]) => {
      gamepad
        .on(button, () => {
          controller.setButtonState(mappedButton, true)
        })
        .before(button, () => {
          controller.setButtonState(mappedButton, true)
        })
        .after(button, () => {
          controller.setButtonState(mappedButton, false)
        })
    })
  })
  return controller
}
