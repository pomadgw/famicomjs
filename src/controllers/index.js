export const Button = {
  A: 1 << 0,
  B: 1 << 1,
  Select: 1 << 2,
  Start: 1 << 3,
  Up: 1 << 4,
  Down: 1 << 5,
  Left: 1 << 6,
  Right: 1 << 7
}

export default class Controller {
  constructor(buttons) {
    this.buttonStatus = 0
    // this.buttonStatusToSend = 0
    this.strobe = false
    this.cursor = 0

    // if (buttons) {
    //   document.addEventListener('keydown', (e) => {
    //     const buttonValue = buttons[e.code]
    //     this.setButtonState(buttonValue, true)
    //   })

    //   document.addEventListener('keyup', (e) => {
    //     const buttonValue = buttons[e.code]
    //     this.setButtonState(buttonValue, false)
    //   })
    // }
  }

  write(value) {
    this.strobe = (value & 1) !== 0

    if (this.strobe) {
      this.cursor = 0
    }
  }

  read() {
    if (this.strobe) {
      return this.buttonStatus & 1
    } else if (this.cursor >= 8) {
      return 0
    } else {
      const value = this.buttonStatusToSend
      this.cursor += 1
      return value
    }
  }

  get buttonStatusToSend() {
    return (this.buttonStatus >> this.cursor) & 1
  }

  setButtonState(buttonType, value) {
    const buttonValue = Button[buttonType]

    if (!buttonValue) return

    this.buttonStatus &= ~buttonValue

    if (value) {
      this.buttonStatus |= buttonValue
    }
  }
}
