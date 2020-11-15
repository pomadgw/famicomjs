import { Flags } from './flags'

export default class RegisterStatus {
  public status: number

  constructor(status: number = 0) {
    this.status = status
  }

  getStatus(flag: Flags): boolean {
    return (this.status & flag) > 0
  }

  setStatus(flag: Flags, value: boolean): void {
    if (value) {
      this.status = this.status | (flag as number)
    } else {
      this.status = this.status & ((~flag & 0xff) as number)
    }
  }

  valueOf(): number {
    return this.status
  }
}
