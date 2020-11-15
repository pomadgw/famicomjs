import Bus from '../bus'
import RegisterStatus from './register'
import { Flags } from './flags'
// import opcodes from './opcodes'

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

      switch (opcode) {
        case 0x0:
          this.impMode()
          this.BRK()
          this.clocks += 7
          break

        case 0x1:
          this.izxMode()
          this.ORA()
          this.clocks += 6
          break

        case 0x2:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x3:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x4:
          this.impMode()
          this.XXX()
          this.clocks += 3
          break

        case 0x5:
          this.zp0Mode()
          this.ORA()
          this.clocks += 3
          break

        case 0x6:
          this.zp0Mode()
          this.ASL()
          this.clocks += 5
          break

        case 0x7:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0x8:
          this.impMode()
          this.PHP()
          this.clocks += 3
          break

        case 0x9:
          this.immMode()
          this.ORA()
          this.clocks += 2
          break

        case 0xa:
          this.impMode()
          this.ASL()
          this.clocks += 2
          break

        case 0xb:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xc:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xd:
          this.absMode()
          this.ORA()
          this.clocks += 4
          break

        case 0xe:
          this.absMode()
          this.ASL()
          this.clocks += 6
          break

        case 0xf:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x10:
          this.relMode()
          this.BPL()
          this.clocks += 2
          break

        case 0x11:
          this.izyMode()
          this.ORA()
          this.clocks += 5
          break

        case 0x12:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x13:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x14:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x15:
          this.zpxMode()
          this.ORA()
          this.clocks += 4
          break

        case 0x16:
          this.zpxMode()
          this.ASL()
          this.clocks += 6
          break

        case 0x17:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x18:
          this.impMode()
          this.CLC()
          this.clocks += 2
          break

        case 0x19:
          this.abyMode()
          this.ORA()
          this.clocks += 4
          break

        case 0x1a:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x1b:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x1c:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x1d:
          this.abxMode()
          this.ORA()
          this.clocks += 4
          break

        case 0x1e:
          this.abxMode()
          this.ASL()
          this.clocks += 7
          break

        case 0x1f:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x20:
          this.absMode()
          this.JSR()
          this.clocks += 6
          break

        case 0x21:
          this.izxMode()
          this.AND()
          this.clocks += 6
          break

        case 0x22:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x23:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x24:
          this.zp0Mode()
          this.BIT()
          this.clocks += 3
          break

        case 0x25:
          this.zp0Mode()
          this.AND()
          this.clocks += 3
          break

        case 0x26:
          this.zp0Mode()
          this.ROL()
          this.clocks += 5
          break

        case 0x27:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0x28:
          this.impMode()
          this.PLP()
          this.clocks += 4
          break

        case 0x29:
          this.immMode()
          this.AND()
          this.clocks += 2
          break

        case 0x2a:
          this.impMode()
          this.ROL()
          this.clocks += 2
          break

        case 0x2b:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x2c:
          this.absMode()
          this.BIT()
          this.clocks += 4
          break

        case 0x2d:
          this.absMode()
          this.AND()
          this.clocks += 4
          break

        case 0x2e:
          this.absMode()
          this.ROL()
          this.clocks += 6
          break

        case 0x2f:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x30:
          this.relMode()
          this.BMI()
          this.clocks += 2
          break

        case 0x31:
          this.izyMode()
          this.AND()
          this.clocks += 5
          break

        case 0x32:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x33:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x34:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x35:
          this.zpxMode()
          this.AND()
          this.clocks += 4
          break

        case 0x36:
          this.zpxMode()
          this.ROL()
          this.clocks += 6
          break

        case 0x37:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x38:
          this.impMode()
          this.SEC()
          this.clocks += 2
          break

        case 0x39:
          this.abyMode()
          this.AND()
          this.clocks += 4
          break

        case 0x3a:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x3b:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x3c:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x3d:
          this.abxMode()
          this.AND()
          this.clocks += 4
          break

        case 0x3e:
          this.abxMode()
          this.ROL()
          this.clocks += 7
          break

        case 0x3f:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x40:
          this.impMode()
          this.RTI()
          this.clocks += 6
          break

        case 0x41:
          this.izxMode()
          this.EOR()
          this.clocks += 6
          break

        case 0x42:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x43:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x44:
          this.impMode()
          this.XXX()
          this.clocks += 3
          break

        case 0x45:
          this.zp0Mode()
          this.EOR()
          this.clocks += 3
          break

        case 0x46:
          this.zp0Mode()
          this.LSR()
          this.clocks += 5
          break

        case 0x47:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0x48:
          this.impMode()
          this.PHA()
          this.clocks += 3
          break

        case 0x49:
          this.immMode()
          this.EOR()
          this.clocks += 2
          break

        case 0x4a:
          this.impMode()
          this.LSR()
          this.clocks += 2
          break

        case 0x4b:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x4c:
          this.absMode()
          this.JMP()
          this.clocks += 3
          break

        case 0x4d:
          this.absMode()
          this.EOR()
          this.clocks += 4
          break

        case 0x4e:
          this.absMode()
          this.LSR()
          this.clocks += 6
          break

        case 0x4f:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x50:
          this.relMode()
          this.BVC()
          this.clocks += 2
          break

        case 0x51:
          this.izyMode()
          this.EOR()
          this.clocks += 5
          break

        case 0x52:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x53:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x54:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x55:
          this.zpxMode()
          this.EOR()
          this.clocks += 4
          break

        case 0x56:
          this.zpxMode()
          this.LSR()
          this.clocks += 6
          break

        case 0x57:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x58:
          this.impMode()
          this.CLI()
          this.clocks += 2
          break

        case 0x59:
          this.abyMode()
          this.EOR()
          this.clocks += 4
          break

        case 0x5a:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x5b:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x5c:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x5d:
          this.abxMode()
          this.EOR()
          this.clocks += 4
          break

        case 0x5e:
          this.abxMode()
          this.LSR()
          this.clocks += 7
          break

        case 0x5f:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x60:
          this.impMode()
          this.RTS()
          this.clocks += 6
          break

        case 0x61:
          this.izxMode()
          this.ADC()
          this.clocks += 6
          break

        case 0x62:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x63:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x64:
          this.impMode()
          this.XXX()
          this.clocks += 3
          break

        case 0x65:
          this.zp0Mode()
          this.ADC()
          this.clocks += 3
          break

        case 0x66:
          this.zp0Mode()
          this.ROR()
          this.clocks += 5
          break

        case 0x67:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0x68:
          this.impMode()
          this.PLA()
          this.clocks += 4
          break

        case 0x69:
          this.immMode()
          this.ADC()
          this.clocks += 2
          break

        case 0x6a:
          this.impMode()
          this.ROR()
          this.clocks += 2
          break

        case 0x6b:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x6c:
          this.indMode()
          this.JMP()
          this.clocks += 5
          break

        case 0x6d:
          this.absMode()
          this.ADC()
          this.clocks += 4
          break

        case 0x6e:
          this.absMode()
          this.ROR()
          this.clocks += 6
          break

        case 0x6f:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x70:
          this.relMode()
          this.BVS()
          this.clocks += 2
          break

        case 0x71:
          this.izyMode()
          this.ADC()
          this.clocks += 5
          break

        case 0x72:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x73:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0x74:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x75:
          this.zpxMode()
          this.ADC()
          this.clocks += 4
          break

        case 0x76:
          this.zpxMode()
          this.ROR()
          this.clocks += 6
          break

        case 0x77:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x78:
          this.impMode()
          this.SEI()
          this.clocks += 2
          break

        case 0x79:
          this.abyMode()
          this.ADC()
          this.clocks += 4
          break

        case 0x7a:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x7b:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x7c:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x7d:
          this.abxMode()
          this.ADC()
          this.clocks += 4
          break

        case 0x7e:
          this.abxMode()
          this.ROR()
          this.clocks += 7
          break

        case 0x7f:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0x80:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x81:
          this.izxMode()
          this.STA()
          this.clocks += 6
          break

        case 0x82:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x83:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x84:
          this.zp0Mode()
          this.STY()
          this.clocks += 3
          break

        case 0x85:
          this.zp0Mode()
          this.STA()
          this.clocks += 3
          break

        case 0x86:
          this.zp0Mode()
          this.STX()
          this.clocks += 3
          break

        case 0x87:
          this.impMode()
          this.XXX()
          this.clocks += 3
          break

        case 0x88:
          this.impMode()
          this.DEY()
          this.clocks += 2
          break

        case 0x89:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x8a:
          this.impMode()
          this.TXA()
          this.clocks += 2
          break

        case 0x8b:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x8c:
          this.absMode()
          this.STY()
          this.clocks += 4
          break

        case 0x8d:
          this.absMode()
          this.STA()
          this.clocks += 4
          break

        case 0x8e:
          this.absMode()
          this.STX()
          this.clocks += 4
          break

        case 0x8f:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x90:
          this.relMode()
          this.BCC()
          this.clocks += 2
          break

        case 0x91:
          this.izyMode()
          this.STA()
          this.clocks += 6
          break

        case 0x92:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0x93:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0x94:
          this.zpxMode()
          this.STY()
          this.clocks += 4
          break

        case 0x95:
          this.zpxMode()
          this.STA()
          this.clocks += 4
          break

        case 0x96:
          this.zpyMode()
          this.STX()
          this.clocks += 4
          break

        case 0x97:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0x98:
          this.impMode()
          this.TYA()
          this.clocks += 2
          break

        case 0x99:
          this.abyMode()
          this.STA()
          this.clocks += 5
          break

        case 0x9a:
          this.impMode()
          this.TXS()
          this.clocks += 2
          break

        case 0x9b:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0x9c:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0x9d:
          this.abxMode()
          this.STA()
          this.clocks += 5
          break

        case 0x9e:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0x9f:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0xa0:
          this.immMode()
          this.LDY()
          this.clocks += 2
          break

        case 0xa1:
          this.izxMode()
          this.LDA()
          this.clocks += 6
          break

        case 0xa2:
          this.immMode()
          this.LDX()
          this.clocks += 2
          break

        case 0xa3:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0xa4:
          this.zp0Mode()
          this.LDY()
          this.clocks += 3
          break

        case 0xa5:
          this.zp0Mode()
          this.LDA()
          this.clocks += 3
          break

        case 0xa6:
          this.zp0Mode()
          this.LDX()
          this.clocks += 3
          break

        case 0xa7:
          this.impMode()
          this.XXX()
          this.clocks += 3
          break

        case 0xa8:
          this.impMode()
          this.TAY()
          this.clocks += 2
          break

        case 0xa9:
          this.immMode()
          this.LDA()
          this.clocks += 2
          break

        case 0xaa:
          this.impMode()
          this.TAX()
          this.clocks += 2
          break

        case 0xab:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xac:
          this.absMode()
          this.LDY()
          this.clocks += 4
          break

        case 0xad:
          this.absMode()
          this.LDA()
          this.clocks += 4
          break

        case 0xae:
          this.absMode()
          this.LDX()
          this.clocks += 4
          break

        case 0xaf:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xb0:
          this.relMode()
          this.BCS()
          this.clocks += 2
          break

        case 0xb1:
          this.izyMode()
          this.LDA()
          this.clocks += 5
          break

        case 0xb2:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xb3:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0xb4:
          this.zpxMode()
          this.LDY()
          this.clocks += 4
          break

        case 0xb5:
          this.zpxMode()
          this.LDA()
          this.clocks += 4
          break

        case 0xb6:
          this.zpyMode()
          this.LDX()
          this.clocks += 4
          break

        case 0xb7:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xb8:
          this.impMode()
          this.CLV()
          this.clocks += 2
          break

        case 0xb9:
          this.abyMode()
          this.LDA()
          this.clocks += 4
          break

        case 0xba:
          this.impMode()
          this.TSX()
          this.clocks += 2
          break

        case 0xbb:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xbc:
          this.abxMode()
          this.LDY()
          this.clocks += 4
          break

        case 0xbd:
          this.abxMode()
          this.LDA()
          this.clocks += 4
          break

        case 0xbe:
          this.abyMode()
          this.LDX()
          this.clocks += 4
          break

        case 0xbf:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xc0:
          this.immMode()
          this.CPY()
          this.clocks += 2
          break

        case 0xc1:
          this.izxMode()
          this.CMP()
          this.clocks += 6
          break

        case 0xc2:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xc3:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0xc4:
          this.zp0Mode()
          this.CPY()
          this.clocks += 3
          break

        case 0xc5:
          this.zp0Mode()
          this.CMP()
          this.clocks += 3
          break

        case 0xc6:
          this.zp0Mode()
          this.DEC()
          this.clocks += 5
          break

        case 0xc7:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0xc8:
          this.impMode()
          this.INY()
          this.clocks += 2
          break

        case 0xc9:
          this.immMode()
          this.CMP()
          this.clocks += 2
          break

        case 0xca:
          this.impMode()
          this.DEX()
          this.clocks += 2
          break

        case 0xcb:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xcc:
          this.absMode()
          this.CPY()
          this.clocks += 4
          break

        case 0xcd:
          this.absMode()
          this.CMP()
          this.clocks += 4
          break

        case 0xce:
          this.absMode()
          this.DEC()
          this.clocks += 6
          break

        case 0xcf:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0xd0:
          this.relMode()
          this.BNE()
          this.clocks += 2
          break

        case 0xd1:
          this.izyMode()
          this.CMP()
          this.clocks += 5
          break

        case 0xd2:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xd3:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0xd4:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xd5:
          this.zpxMode()
          this.CMP()
          this.clocks += 4
          break

        case 0xd6:
          this.zpxMode()
          this.DEC()
          this.clocks += 6
          break

        case 0xd7:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0xd8:
          this.impMode()
          this.CLD()
          this.clocks += 2
          break

        case 0xd9:
          this.abyMode()
          this.CMP()
          this.clocks += 4
          break

        case 0xda:
          this.impMode()
          this.NOP()
          this.clocks += 2
          break

        case 0xdb:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0xdc:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xdd:
          this.abxMode()
          this.CMP()
          this.clocks += 4
          break

        case 0xde:
          this.abxMode()
          this.DEC()
          this.clocks += 7
          break

        case 0xdf:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0xe0:
          this.immMode()
          this.CPX()
          this.clocks += 2
          break

        case 0xe1:
          this.izxMode()
          this.SBC()
          this.clocks += 6
          break

        case 0xe2:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xe3:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0xe4:
          this.zp0Mode()
          this.CPX()
          this.clocks += 3
          break

        case 0xe5:
          this.zp0Mode()
          this.SBC()
          this.clocks += 3
          break

        case 0xe6:
          this.zp0Mode()
          this.INC()
          this.clocks += 5
          break

        case 0xe7:
          this.impMode()
          this.XXX()
          this.clocks += 5
          break

        case 0xe8:
          this.impMode()
          this.INX()
          this.clocks += 2
          break

        case 0xe9:
          this.immMode()
          this.SBC()
          this.clocks += 2
          break

        case 0xea:
          this.impMode()
          this.NOP()
          this.clocks += 2
          break

        case 0xeb:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xec:
          this.absMode()
          this.CPX()
          this.clocks += 4
          break

        case 0xed:
          this.absMode()
          this.SBC()
          this.clocks += 4
          break

        case 0xee:
          this.absMode()
          this.INC()
          this.clocks += 6
          break

        case 0xef:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0xf0:
          this.relMode()
          this.BEQ()
          this.clocks += 2
          break

        case 0xf1:
          this.izyMode()
          this.SBC()
          this.clocks += 5
          break

        case 0xf2:
          this.impMode()
          this.XXX()
          this.clocks += 2
          break

        case 0xf3:
          this.impMode()
          this.XXX()
          this.clocks += 8
          break

        case 0xf4:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xf5:
          this.zpxMode()
          this.SBC()
          this.clocks += 4
          break

        case 0xf6:
          this.zpxMode()
          this.INC()
          this.clocks += 6
          break

        case 0xf7:
          this.impMode()
          this.XXX()
          this.clocks += 6
          break

        case 0xf8:
          this.impMode()
          this.SED()
          this.clocks += 2
          break

        case 0xf9:
          this.abyMode()
          this.SBC()
          this.clocks += 4
          break

        case 0xfa:
          this.impMode()
          this.NOP()
          this.clocks += 2
          break

        case 0xfb:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        case 0xfc:
          this.impMode()
          this.XXX()
          this.clocks += 4
          break

        case 0xfd:
          this.abxMode()
          this.SBC()
          this.clocks += 4
          break

        case 0xfe:
          this.abxMode()
          this.INC()
          this.clocks += 7
          break

        case 0xff:
          this.impMode()
          this.XXX()
          this.clocks += 7
          break

        default:
          break
      }

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

    this.absoluteAddress = absoluteAddress & 0xffff
    this.clocks += (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }

  abyMode(): void {
    const lo = this.read(this.nextPC())
    const hi = this.read(this.nextPC())

    const offset = this.Y
    const absoluteAddress = ((hi << 8) | lo) + offset

    this.absoluteAddress = absoluteAddress & 0xffff
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
