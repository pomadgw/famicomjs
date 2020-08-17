export const FLAGS = {
  N: 1 << 7,
  V: 1 << 6,
  NONE: 1 << 5,
  B: 1 << 4,
  D: 1 << 3,
  I: 1 << 2,
  Z: 1 << 1,
  C: 1
}

export default class RegisterStatus {
  constructor(status = 0) {
    this.status = status
  }

  getStatus(flag) {
    return (this.status & FLAGS[flag]) > 0
  }

  setStatus(flag, value) {
    if (value) {
      this.status = this.status | FLAGS[flag]
    } else {
      this.status = this.status & (~FLAGS[flag] & 0xff)
    }
  }
}
