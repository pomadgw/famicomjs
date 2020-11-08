import { Flags } from './flags'

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
      this.status = this.status | (flag as u8)
    } else {
      this.status = this.status & ((~flag & 0xff) as u8)
    }
  }

  valueOf(): u8 {
    return this.status
  }
}
