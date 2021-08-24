export class NESStatus {
  sab: SharedArrayBuffer

  constructor(sab: SharedArrayBuffer) {
    this.sab = sab
  }

  get sabControllerByte() {
    return new Uint8Array(this.sab)
  }

  keyDownButton(button: number) {
    this.sabControllerByte[0] = 1
    this.sabControllerByte[1] = 1
    this.sabControllerByte[2] = button
  }

  keyUpButton(button: number) {
    this.sabControllerByte[0] = 1
    this.sabControllerByte[1] = 0
    this.sabControllerByte[2] = button
  }

  isKeyDown() {
    return this.sabControllerByte[1] === 1
  }

  isKeyUp() {
    return this.sabControllerByte[1] === 0
  }

  checkButton() {
    const result = this.sabControllerByte[0] === 1

    this.sabControllerByte[0] = 0

    return result
  }

  get pressedButton() {
    return this.sabControllerByte[2]
  }

  get reset() {
    if (this.sabControllerByte[4] === 1) {
      this.sabControllerByte[4] = 0
      return this.sabControllerByte[3] === 1
    }

    return false
  }

  set reset(status: boolean) {
    this.sabControllerByte[3] = status ? 1 : 0
    this.sabControllerByte[4] = 1
  }

  get paused() {
    return this.sabControllerByte[5] === 1
  }

  get isPausedVarChanged() {
    const result = this.sabControllerByte[6] === 1

    this.sabControllerByte[6] = 0

    return result
  }

  set paused(status: boolean) {
    this.sabControllerByte[5] = status ? 1 : 0
    this.sabControllerByte[6] = 1
  }
}
