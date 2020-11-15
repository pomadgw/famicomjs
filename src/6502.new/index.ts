import Bus from '../bus'
import RegisterStatus from './register'
import { Flags } from './flags'
import opcodes from './opcodes'

export default class CPU {
  private bus: Bus | null
  private isImplicitInvoked: boolean
  private opcode: number

  public A: number
  public X: number
  public Y: number
  public STATUS: RegisterStatus
  public SP: number
  public PC: number
  public absoluteAddress: number
  public relativeAddress: number
  public clocks: number
  public debugCycles: number
  public debugCurrentOpsPC: number
  public debugCurrentOps: number[]

  public fetchedData: number

  constructor() {
    this.bus = null
    this.STATUS = new RegisterStatus(0)

    this.reset()

    this.absoluteAddress = 0
    this.relativeAddress = 0
    this.clocks = 0
    this.debugCurrentOps = []
  }

  connect(bus: Bus): void {
    this.bus = bus
  }

  reset(): void {
    this.A = 0
    this.X = 0
    this.Y = 0
    this.SP = 0xfd
    // this.PC = 0
    this.fetchedData = 0
    this.STATUS = new RegisterStatus(0x24)
    this.isImplicitInvoked = false
    this.opcode = 0

    const startPCAddress: number = 0xfffc
    const loPC = this.read(startPCAddress)
    const hiPC = this.read(startPCAddress + 1)
    this.PC = (hiPC << 8) | loPC
    this.debugCurrentOpsPC = this.PC

    this.absoluteAddress = 0
    this.relativeAddress = 0
    this.fetchedData = 0
    this.clocks = 8
  }

  read(address: number): number {
    const bus = this.bus
    if (!bus) return 0
    return bus.cpuRead(address)
  }

  write(address: number, value: number): void {
    const bus = this.bus
    if (!bus) return
    bus.cpuWrite(address, value)
  }

  nextPC(): number {
    return this.PC++
  }

  clock(): void {
    this.debugCycles += 1

    if (this.clocks === 0) {
      this.debugCurrentOpsPC = this.PC
      const opcode = this.read(this.nextPC())
      this.opcode = opcode

      this.debugCurrentOps = [
        opcode,
        this.read(this.PC + 0),
        this.read(this.PC + 1)
      ]

      opcodes(this, opcode)
      this.isImplicitInvoked = false
    }

    this.clocks -= 1
  }

  fetch(): void {
    if (!this.isImplicitInvoked)
      this.fetchedData = this.read(this.absoluteAddress)
  }

  pushStack(value: number): void {
    this.write((this.SP + 0x100), value)

    this.SP--
    this.SP &= 0xff
  }

  popStack(): number {
    this.SP++
    this.SP &= 0xff

    const temp = this.read((this.SP + 0x100))

    return temp
  }

  private interrupt(targetAddress: number): void {
    const PC = this.PC
    this.pushStack(((PC >> 8) & 0xff))
    this.pushStack((PC & 0xff))

    this.STATUS.setStatus(Flags.B, false)
    this.STATUS.setStatus(Flags.U, true)
    this.STATUS.setStatus(Flags.I, true)

    this.pushStack(this.STATUS.status)

    this.absoluteAddress = targetAddress

    const loPC = this.read(targetAddress)
    const hiPC = this.read(targetAddress + 1)
    this.PC = (hiPC << 8) | loPC

    this.clocks = 7
  }

  irq(): void {
    if (this.STATUS.getStatus(Flags.I)) {
      this.interrupt(0xfffe)
    }
  }

  nmi(): void {
    this.interrupt(0xfffa)
  }

  // #region ADDRESSING MODES
  absMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const absoluteAddress = (hi << 8) | lo

    this.absoluteAddress = absoluteAddress
    this.clocks += 0
  }

  abxMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const offset = this.X
    const absoluteAddress = ((hi << 8) | lo) + offset

    this.absoluteAddress = absoluteAddress
    this.clocks += (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }

  abyMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const offset = this.Y
    const absoluteAddress = ((hi << 8) | lo) + offset

    this.absoluteAddress = absoluteAddress
    this.clocks += (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }

  immMode(): void {
    this.absoluteAddress = this.nextPC()
  }

  impMode(): void {
    this.fetchedData = this.A
    this.isImplicitInvoked = true
  }

  zp0Mode(): void {
    const address = this.read(this.nextPC())

    this.absoluteAddress = address
  }

  zpxMode(): void {
    const address = this.read(this.nextPC())

    this.absoluteAddress = (address + this.X) & 0xff
  }

  zpyMode(): void {
    const address = this.read(this.nextPC())

    this.absoluteAddress = (address + this.Y) & 0xff
  }

  relMode(): void {
    let offset: number = this.read(this.nextPC())

    if (offset > 0x7f) offset -= 0x100

    this.relativeAddress = offset
  }

  indMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const pointer: number = (hi << 8) | lo

    const actualLo = this.read(pointer)

    const pointerHi: number = lo === 0xff ? pointer & 0xff00 : pointer + 1
    const actualHi = this.read(pointerHi)

    this.absoluteAddress = (actualHi << 8) | actualLo
  }

  izxMode(): void {
    const tableAddress = this.read(this.nextPC())
    const lo: number = this.read((tableAddress + this.X) & 0xff)
    const hi: number = this.read((tableAddress + this.X + 1) & 0xff)

    this.absoluteAddress = (hi << 8) | lo
  }

  izyMode(): void {
    const tableAddress = this.read(this.nextPC())

    const lo: number = this.read(tableAddress & 0xff)
    const hi: number = this.read((tableAddress + 1) & 0xff)

    this.absoluteAddress = (((hi << 8) | lo) + this.Y) & 0xffff

    this.clocks += (this.absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }
  // #endregion

  // #region OPERATORS

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  XXX(): void {}

  // #region Clear Status

  CLC(): void {
    this.STATUS.setStatus(Flags.C, false)
  }

  CLD(): void {
    this.STATUS.setStatus(Flags.D, false)
  }

  CLI(): void {
    this.STATUS.setStatus(Flags.I, false)
  }

  CLV(): void {
    this.STATUS.setStatus(Flags.V, false)
  }

  // #endregion

  // #region Set Status

  SEC(): void {
    this.STATUS.setStatus(Flags.C, true)
  }

  SED(): void {
    this.STATUS.setStatus(Flags.D, true)
  }

  SEI(): void {
    this.STATUS.setStatus(Flags.I, true)
  }

  // #endregion

  // #region Load/Store from/to register
  private setZN(value: number): void {
    this.STATUS.setStatus(Flags.N, value >= 0x80)
    this.STATUS.setStatus(Flags.Z, value === 0)
  }

  LDA(): void {
    this.fetch()
    const content = this.fetchedData

    this.A = this.fetchedData
    this.setZN(content)

    this.clocks += 0
  }
  LDX(): void {
    this.fetch()
    const content = this.fetchedData

    this.X = this.fetchedData
    this.setZN(content)

    this.clocks += 0
  }
  LDY(): void {
    this.fetch()
    const content = this.fetchedData

    this.Y = this.fetchedData
    this.setZN(content)

    this.clocks += 0
  }

  STA(): void {
    this.write(this.absoluteAddress, this.A)
  }
  STX(): void {
    this.write(this.absoluteAddress, this.X)
  }
  STY(): void {
    this.write(this.absoluteAddress, this.Y)
  }
  // #endregion

  // #region Load/Store from/to register
  ADC(): void {
    this.fetch()

    const carryBit: number = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const temp: number = (this.A) + (this.fetchedData) + carryBit

    this.STATUS.setStatus(Flags.C, temp > 0xff)

    const result: number = (temp & 0xff)

    this.setZN(result)

    const isOverflow =
      (~(this.A ^ this.fetchedData) & (this.A ^ result) & 0x0080) > 0

    this.STATUS.setStatus(Flags.V, isOverflow)
    this.A = result

    this.clocks += 1
  }

  SBC(): void {
    this.fetch()

    const fetched: number = ((this.fetchedData) ^ 0xff) & 0xff
    const carryBit: number = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const temp: number = (this.A) + (fetched) + carryBit

    this.STATUS.setStatus(Flags.C, temp > 0xff)

    const result: number = (temp & 0xff)

    this.setZN(result)

    const isOverflow = (~(this.A ^ fetched) & (this.A ^ temp) & 0x0080) > 0

    this.STATUS.setStatus(Flags.V, isOverflow)
    this.A = result

    this.clocks += 1
  }

  INC(): void {
    this.fetch()

    const result: number = (this.fetchedData + 1) & 0xff
    this.write(this.absoluteAddress, result)
    this.setZN(result)
  }

  INX(): void {
    const result: number = (this.X + 1) & 0xff
    this.X = result
    this.setZN(result)
  }

  INY(): void {
    const result: number = (this.Y + 1) & 0xff
    this.Y = result
    this.setZN(result)
  }
  DEC(): void {
    this.fetch()

    const result: number = (this.fetchedData - 1) & 0xff
    this.write(this.absoluteAddress, result)
    this.setZN(result)
  }
  DEX(): void {
    const result: number = (this.X - 1) & 0xff
    this.X = result
    this.setZN(result)
  }
  DEY(): void {
    const result: number = (this.Y - 1) & 0xff
    this.Y = result
    this.setZN(result)
  }
  // #endregion

  // #region Branching
  JMP(): void {
    this.PC = this.absoluteAddress
  }

  JSR(): void {
    const prevPC: number = this.PC - 1

    this.pushStack(((prevPC >> 8) & 0xff))
    this.pushStack((prevPC & 0xff))

    this.JMP()
  }

  RTS(): void {
    let nextPC: number = this.popStack()
    nextPC |= (this.popStack()) << 8

    this.PC = nextPC + 1
  }

  private jumpIfTrue(condition: boolean): void {
    if (condition) {
      this.clocks += 1
      this.absoluteAddress = this.relativeAddress + this.PC

      if ((this.absoluteAddress & 0xff00) !== (this.PC & 0xff00)) {
        this.clocks += 1
      }

      this.PC = this.absoluteAddress
    }
  }

  BCC(): void {
    this.jumpIfTrue(!this.STATUS.getStatus(Flags.C))
  }

  BCS(): void {
    this.jumpIfTrue(this.STATUS.getStatus(Flags.C))
  }

  BEQ(): void {
    this.jumpIfTrue(this.STATUS.getStatus(Flags.Z))
  }

  BNE(): void {
    this.jumpIfTrue(!this.STATUS.getStatus(Flags.Z))
  }

  BMI(): void {
    this.jumpIfTrue(this.STATUS.getStatus(Flags.N))
  }

  BPL(): void {
    this.jumpIfTrue(!this.STATUS.getStatus(Flags.N))
  }

  BVS(): void {
    this.jumpIfTrue(this.STATUS.getStatus(Flags.V))
  }

  BVC(): void {
    this.jumpIfTrue(!this.STATUS.getStatus(Flags.V))
  }
  // #endregion

  // #region Bitwise
  AND(): void {
    this.fetch()
    const result = this.A & this.fetchedData
    this.A = result
    this.setZN(result)

    this.clocks += 1
  }

  ORA(): void {
    this.fetch()
    const result = this.A | this.fetchedData
    this.A = result
    this.setZN(result)

    this.clocks += 1
  }

  EOR(): void {
    this.fetch()
    const result = this.A ^ this.fetchedData
    this.A = result
    this.setZN(result)

    this.clocks += 1
  }

  ASL(): void {
    this.fetch()
    const temp: number = (this.fetchedData) << 1

    this.STATUS.setStatus(Flags.C, (temp & 0xff00) > 0)
    this.setZN((temp & 0xff))

    if (this.isImplicitInvoked) {
      this.A = (temp & 0xff)
    } else {
      this.write(this.absoluteAddress, (temp & 0xff))
    }
  }

  BIT(): void {
    this.fetch()
    const temp = this.fetchedData & this.A
    this.STATUS.setStatus(Flags.Z, temp === 0)

    this.STATUS.setStatus(Flags.N, (this.fetchedData & Flags.N) > 0)
    this.STATUS.setStatus(Flags.V, (this.fetchedData & Flags.V) > 0)
  }

  LSR(): void {
    this.fetch()
    this.STATUS.setStatus(Flags.C, (this.fetchedData & 0x01) === 1)
    const result: number = (this.fetchedData >> 1) & 0xff

    this.setZN(result)

    if (this.isImplicitInvoked) {
      this.A = result
    } else {
      this.write(this.absoluteAddress, result)
    }
  }

  ROL(): void {
    this.fetch()
    const carryBit: number = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const result: number = (((this.fetchedData) << 1) + carryBit) & 0xff

    this.STATUS.setStatus(Flags.C, (this.fetchedData & 0b10000000) > 0)

    this.setZN(result)

    if (this.isImplicitInvoked) {
      this.A = result
    } else {
      this.write(this.absoluteAddress, result)
    }
  }

  ROR(): void {
    this.fetch()
    const carryBit: number = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const result: number =
      (((this.fetchedData) >> 1) | (carryBit << 7)) & 0xff

    this.STATUS.setStatus(Flags.C, (this.fetchedData & 0x01) > 0)

    this.setZN(result)

    if (this.isImplicitInvoked) {
      this.A = result
    } else {
      this.write(this.absoluteAddress, result)
    }
  }
  // #endregion

  // #region Interrupts

  BRK(): void {
    this.nextPC()

    const pc = this.PC

    this.pushStack(((pc >> 8) & 0xff))
    this.pushStack((pc & 0xff))

    this.STATUS.setStatus(Flags.I, true)

    this.STATUS.setStatus(Flags.B, true)
    this.pushStack(this.STATUS.status)
    this.STATUS.setStatus(Flags.B, false)

    const newPCLo: number = this.read(0xfffe)
    const newPCHi: number = this.read(0xffff)

    this.PC = (newPCHi << 8) | newPCLo
  }

  RTI(): void {
    let status: number = this.popStack()
    const newPCLo: number = this.popStack()
    const newPCHi: number = this.popStack()

    status &= ~(Flags.U)
    status &= ~(Flags.B)

    this.STATUS.status = status
    this.PC = (newPCHi << 8) | newPCLo
  }

  // #endregion

  // #region Comparison
  CMP(): void {
    this.fetch()
    const temp = this.A - this.fetchedData

    this.STATUS.setStatus(Flags.C, temp >= 0)
    this.STATUS.setStatus(Flags.Z, temp === 0)
    this.STATUS.setStatus(Flags.N, temp < 0 || temp >= 0x80)

    this.clocks += 1
  }
  CPX(): void {
    this.fetch()
    const temp = this.X - this.fetchedData

    this.STATUS.setStatus(Flags.C, temp >= 0)
    this.STATUS.setStatus(Flags.Z, temp === 0)
    this.STATUS.setStatus(Flags.N, temp < 0 || temp >= 0x80)

    this.clocks += 1
  }
  CPY(): void {
    this.fetch()
    const temp = this.Y - this.fetchedData

    this.STATUS.setStatus(Flags.C, temp >= 0)
    this.STATUS.setStatus(Flags.Z, temp === 0)
    this.STATUS.setStatus(Flags.N, temp < 0 || temp >= 0x80)

    this.clocks += 1
  }
  // #endregion

  // #region Stacks
  PHA(): void {
    this.pushStack(this.A)
  }

  PLA(): void {
    this.A = this.popStack()
    this.setZN(this.A)
  }

  PHP(): void {
    const statusToBePushed =
      this.STATUS.status | (Flags.U) | (Flags.B)

    this.STATUS.setStatus(Flags.U, false)
    this.STATUS.setStatus(Flags.B, false)

    this.pushStack(statusToBePushed)
  }

  PLP(): void {
    const status = this.popStack()
    this.STATUS.status = status
    this.STATUS.setStatus(Flags.U, true)
  }

  TSX(): void {
    this.X = this.SP
    this.setZN(this.X)
  }

  TXS(): void {
    this.SP = this.X
  }
  // #endregion

  // #region Register Transfer
  TAX(): void {
    this.X = this.A
    this.setZN(this.X)
  }

  TAY(): void {
    this.Y = this.A
    this.setZN(this.Y)
  }

  TXA(): void {
    this.A = this.X
    this.setZN(this.A)
  }

  TYA(): void {
    this.A = this.Y
    this.setZN(this.A)
  }
  // #endregion

  // #region NOP
  NOP(): void {
    if ([0x1c, 0x3c, 0x5c, 0x7c, 0xdc, 0xfc].includes(this.opcode)) {
      this.clocks += 1
    }
  }
  // #endregion

  // #endregion
}
