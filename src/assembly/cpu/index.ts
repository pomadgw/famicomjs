import Bus from '../bus'
import RegisterStatus from './register'
import { Flags } from './flags'
import opcodes from './opcodes'

export default class CPU {
  private bus: Bus
  private isImplicitInvoked: boolean
  private opcode: u8

  public A: u8
  public X: u8
  public Y: u8
  public STATUS: RegisterStatus
  public SP: u8
  public PC: u16
  public absoluteAddress: u16
  public relativeAddress: i16
  public clocks: usize

  public fetchedData: u8

  constructor(bus: Bus) {
    this.bus = bus
    this.STATUS = new RegisterStatus(0)

    this.reset()

    this.absoluteAddress = 0
    this.relativeAddress = 0
    this.clocks = 0
  }

  reset(): void {
    this.A = 0
    this.X = 0
    this.Y = 0
    this.SP = 0xfd
    this.PC = 0
    this.fetchedData = 0
    this.STATUS = new RegisterStatus(0x24)
    this.isImplicitInvoked = false
    this.opcode = 0
  }

  read(address: u16): u8 {
    return this.bus.cpuRead(address)
  }

  write(address: u16, value: u8): void {
    this.bus.cpuWrite(address, value)
  }

  nextPC(): u16 {
    return this.PC++
  }

  clock(): void {
    if (this.clocks === 0) {
      const opcode = this.read(this.nextPC())
      this.opcode = opcode
      opcodes(this, opcode)
      this.isImplicitInvoked = false
    }

    this.clocks -= 1
  }

  fetch(): void {
    if (!this.isImplicitInvoked)
      this.fetchedData = this.read(this.absoluteAddress)
  }

  pushStack(value: u8): void {
    this.write((this.SP + 0x100) as u16, value)

    this.SP--
    this.SP &= 0xff
  }

  popStack(): u8 {
    this.SP++
    this.SP &= 0xff

    const temp = this.read((this.SP + 0x100) as u16)

    return temp
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
    let offset: i16 = this.read(this.nextPC())

    if (offset > 0x7f) offset -= 0x100 as i16

    this.relativeAddress = offset
  }

  indMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const pointer: u16 = (hi << 8) | lo

    const actualLo = this.read(pointer)

    const pointerHi: u16 = lo === 0xff ? pointer & 0xff00 : pointer + 1
    const actualHi = this.read(pointerHi)

    this.absoluteAddress = (actualHi << 8) | actualLo
  }

  izxMode(): void {
    const tableAddress = this.read(this.nextPC())
    const lo: u16 = this.read((tableAddress + this.X) & 0xff)
    const hi: u16 = this.read((tableAddress + this.X + 1) & 0xff)

    this.absoluteAddress = (hi << 8) | lo
  }

  izyMode(): void {
    const tableAddress = this.read(this.nextPC())

    const lo: u16 = this.read(tableAddress & 0xff)
    const hi: u16 = this.read((tableAddress + 1) & 0xff)

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
  private setZN(value: u8): void {
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

    const carryBit: u16 = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const temp: u16 = (this.A as u16) + (this.fetchedData as u16) + carryBit

    this.STATUS.setStatus(Flags.C, temp > 0xff)

    const result: u8 = (temp & 0xff) as u8

    this.setZN(result)

    const isOverflow =
      (~(this.A ^ this.fetchedData) & (this.A ^ result) & 0x0080) > 0

    this.STATUS.setStatus(Flags.V, isOverflow)
    this.A = result

    this.clocks += 1
  }

  SBC(): void {
    this.fetch()

    const fetched: u16 = ((this.fetchedData as u16) ^ 0xff) & 0xff
    const carryBit: u16 = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const temp: u16 = (this.A as u16) + (fetched as u16) + carryBit

    this.STATUS.setStatus(Flags.C, temp > 0xff)

    const result: u8 = (temp & 0xff) as u8

    this.setZN(result)

    const isOverflow = (~(this.A ^ fetched) & (this.A ^ temp) & 0x0080) > 0

    this.STATUS.setStatus(Flags.V, isOverflow)
    this.A = result

    this.clocks += 1
  }

  INC(): void {
    this.fetch()

    const result: u8 = (this.fetchedData + 1) & 0xff
    this.write(this.absoluteAddress, result)
    this.setZN(result)
  }

  INX(): void {
    const result: u8 = (this.X + 1) & 0xff
    this.X = result
    this.setZN(result)
  }

  INY(): void {
    const result: u8 = (this.Y + 1) & 0xff
    this.Y = result
    this.setZN(result)
  }
  DEC(): void {
    this.fetch()

    const result: u8 = (this.fetchedData - 1) & 0xff
    this.write(this.absoluteAddress, result)
    this.setZN(result)
  }
  DEX(): void {
    const result: u8 = (this.X - 1) & 0xff
    this.X = result
    this.setZN(result)
  }
  DEY(): void {
    const result: u8 = (this.Y - 1) & 0xff
    this.Y = result
    this.setZN(result)
  }
  // #endregion

  // #region Branching
  JMP(): void {
    this.PC = this.absoluteAddress
  }

  JSR(): void {
    const prevPC: u16 = this.PC - 1

    this.pushStack(((prevPC >> 8) & 0xff) as u8)
    this.pushStack((prevPC & 0xff) as u8)

    this.JMP()
  }

  RTS(): void {
    let nextPC: u16 = this.popStack() as u16
    nextPC |= (this.popStack() as u16) << 8

    this.PC = nextPC + 1
  }

  private jumpIfTrue(condition: bool): void {
    if (condition) {
      this.clocks += 1
      this.absoluteAddress = ((this.relativeAddress as i32) +
        (this.PC as i32)) as u16

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
    const temp: u16 = (this.fetchedData as u16) << 1

    this.STATUS.setStatus(Flags.C, (temp & 0xff00) > 0)
    this.setZN((temp & 0xff) as u8)

    if (this.isImplicitInvoked) {
      this.A = (temp & 0xff) as u8
    } else {
      this.write(this.absoluteAddress, (temp & 0xff) as u8)
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
    const result: u8 = (this.fetchedData >> 1) & 0xff

    this.setZN(result)

    if (this.isImplicitInvoked) {
      this.A = result
    } else {
      this.write(this.absoluteAddress, result)
    }
  }

  ROL(): void {
    this.fetch()
    const carryBit: u8 = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const result: u8 = (((this.fetchedData as u8) << 1) + carryBit) & 0xff

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
    const carryBit: u8 = this.STATUS.getStatus(Flags.C) ? 1 : 0
    const result: u8 =
      (((this.fetchedData as u8) >> 1) | (carryBit << 7)) & 0xff

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

    this.pushStack(((pc >> 8) & 0xff) as u8)
    this.pushStack((pc & 0xff) as u8)

    this.STATUS.setStatus(Flags.I, true)

    this.STATUS.setStatus(Flags.B, true)
    this.pushStack(this.STATUS.status)
    this.STATUS.setStatus(Flags.B, false)

    const newPCLo: u16 = this.read(0xfffe) as u16
    const newPCHi: u16 = this.read(0xffff) as u16

    this.PC = (newPCHi << 8) | newPCLo
  }

  RTI(): void {
    let status: u8 = this.popStack()
    const newPCLo: u16 = this.popStack() as u16
    const newPCHi: u16 = this.popStack() as u16

    status &= ~(Flags.U as u8)
    status &= ~(Flags.B as u8)

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
      this.STATUS.status | (Flags.U as u8) | (Flags.B as u8)

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

  // #region NOP
  NOP(): void {
    if ([0x1c, 0x3c, 0x5c, 0x7c, 0xdc, 0xfc].includes(this.opcode)) {
      this.clocks += 1
    }
  }
  // #endregion

  // #endregion
}
