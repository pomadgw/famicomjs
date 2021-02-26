// eslint-disable-next-line
import Bus from '../bus'

export enum IRQ {
  RESET = 1,
  NMI = 2
}

enum CPUOperationState {
  READ_OPCODE,
  ADDRESING,
  INSTRUCTION
}

enum StatusFlag {
  C = 0b00000001,
  Z = 0b00000010,
  I = 0b00000100,
  D = 0b00001000,
  B = 0b00010000,
  U = 0b00100000,
  V = 0b01000000,
  N = 0b10000000
}

type Callback = () => void

export default class CPU {
  public A = 0
  public X = 0
  public Y = 0
  // STATUS flag
  public P = 0
  public SP = 0
  public PC = 0

  public cycles = 0
  public sync = false
  public isImplicitInvoked = false

  private irqTrigger: IRQ = 0
  private currentOpcode = 0

  private state: CPUOperationState = CPUOperationState.READ_OPCODE
  private step = 0

  reset() {
    this.irqTrigger |= IRQ.RESET
    this.sync = true
    this.SP = 0xff
  }

  clock(bus: Bus) {
    if (this.sync) {
      this.sync = false
      this.isImplicitInvoked = false
      this.step = 0
      if (this.irqTrigger !== 0) {
        this.currentOpcode = 0
      } else {
        this.currentOpcode = bus.read(this.PC++)
      }
      console.log({ currentOpcode: this.currentOpcode })
    }

    switch (this.currentOpcode) {
      case 0x00:
        if (this.step === 0) {
          const hi = (this.PC >> 8) & 0xff
          const lo = this.PC & 0xff

          this.pushStack(bus, hi)
          this.pushStack(bus, lo)
          this.P |= StatusFlag.B
          this.P |= StatusFlag.U

          if ((this.irqTrigger & IRQ.RESET) !== 0) {
            this.pushStack(bus, 0)
          } else {
            this.pushStack(bus, this.P)
            this.P &= ~StatusFlag.U
          }
          this.P &= ~StatusFlag.B
          this.P |= StatusFlag.I

          let vectorAddress = 0xfffe

          if ((this.irqTrigger & IRQ.RESET) !== 0) {
            vectorAddress = 0xfffc
          } else if ((this.irqTrigger & IRQ.NMI) !== 0) {
            vectorAddress = 0xfffa
          }

          this.PC |= bus.read(vectorAddress)
          this.PC |= bus.read(vectorAddress + 1) << 8
        }

        this.onStep(6, () => {
          this.sync = true
        })
        break
      default:
        this.sync = true
        break
    }

    this.step++
    this.cycles++
  }

  private pushStack(bus: Bus, value: number) {
    bus.write(0x100 + this.SP, value)
    this.SP = (this.SP - 1) & 0xff
  }

  private popStack(bus: Bus, value: number) {
    this.SP = (this.SP + 1) & 0xff
    return bus.read(0x100 + this.SP)
  }

  private onStep(step: number, callback: Callback) {
    if (step === this.step) {
      callback()
    }
  }
}
