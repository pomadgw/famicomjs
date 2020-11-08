export enum Flags {
  N = 1 << 7,
  V = 1 << 6,
  U = 1 << 5,
  B = 1 << 4,
  D = 1 << 3,
  I = 1 << 2,
  Z = 1 << 1,
  C = 1
}

export default class RegisterStatus {
  public status: u8

  constructor(status: u8 = 0) {
    this.status = status
  }

  getStatus(flag: Flags): bool {
    return (this.status & flag) > 0
  }

  setStatus(flag: Flags, value: bool): void {
    if (value) {
      this.status = this.status | flag
    } else {
      this.status = this.status & (~flag & 0xff)
    }
  }

  valueOf(): u8 {
    return this.status
  }
}
