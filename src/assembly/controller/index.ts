export enum Button {
  A = 1 << 0,
  B = 1 << 1,
  Select = 1 << 2,
  Start = 1 << 3,
  Up = 1 << 4,
  Down = 1 << 5,
  Left = 1 << 6,
  Right = 1 << 7
}

export default class Controller {
  public buttonStatus: u8
  public cursor: u8
  private strobe: bool
  constructor() {
    this.buttonStatus = 0
    this.strobe = false
    this.cursor = 0
  }

  write(value: u8): void {
    this.strobe = (value & 1) !== 0

    if (this.strobe) {
      this.cursor = 0
    }
  }

  read(): u8 {
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

  get buttonStatusToSend(): u8 {
    return (this.buttonStatus >> this.cursor) & 1
  }

  setButtonState(buttonType: Button, value: bool): void {
    if (!buttonType) return

    this.buttonStatus &= ~(buttonType as u8)

    if (value) {
      this.buttonStatus |= buttonType as u8
    }
  }
}
