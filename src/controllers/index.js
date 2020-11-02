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
    this.buttonStatusToSend = 0
    this.strobe = false

    if (buttons) {
      document.addEventListener('keydown', (e) => {
        const buttonValue = buttons[e.code]
        this.setButtonState(buttonValue, true)
      })

      document.addEventListener('keyup', (e) => {
        const buttonValue = buttons[e.code]
        this.setButtonState(buttonValue, false)
      })
    }
  }

  write(value) {
    this.strobe = (value & 1) > 0
  }

  read() {
    if (this.strobe) {
      return this.buttonStatus & 1
    } else if (this.buttonStatusToSend === 0) {
      return 1
    } else {
      const value = this.buttonStatusToSend & 1
      this.buttonStatusToSend >>= 1
      return value
    }
  }

  setButtonState(buttonType, value) {
    const buttonValue = Button[buttonType]

    if (value) {
      this.buttonStatus |= buttonValue
    } else {
      this.buttonStatus &= ~buttonValue
    }

    if (this.strobe) {
      this.buttonStatusToSend = this.buttonStatus
    }
  }
}
