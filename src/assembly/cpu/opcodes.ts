import CPU from './index'

export default function execute(cpu: CPU, opcode: u8): void {
  switch (opcode) {
    case 0x0:
      cpu.impMode()
      cpu.BRK()
      cpu.clocks += 7
      break

    case 0x1:
      cpu.izxMode()
      cpu.ORA()
      cpu.clocks += 6
      break

    case 0x2:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x3:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x4:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 3
      break

    case 0x5:
      cpu.zp0Mode()
      cpu.ORA()
      cpu.clocks += 3
      break

    case 0x6:
      cpu.zp0Mode()
      cpu.ASL()
      cpu.clocks += 5
      break

    case 0x7:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0x8:
      cpu.impMode()
      cpu.PHP()
      cpu.clocks += 3
      break

    case 0x9:
      cpu.immMode()
      cpu.ORA()
      cpu.clocks += 2
      break

    case 0xa:
      cpu.impMode()
      cpu.ASL()
      cpu.clocks += 2
      break

    case 0xb:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xc:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xd:
      cpu.absMode()
      cpu.ORA()
      cpu.clocks += 4
      break

    case 0xe:
      cpu.absMode()
      cpu.ASL()
      cpu.clocks += 6
      break

    case 0xf:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x10:
      cpu.relMode()
      cpu.BPL()
      cpu.clocks += 2
      break

    case 0x11:
      cpu.izyMode()
      cpu.ORA()
      cpu.clocks += 5
      break

    case 0x12:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x13:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x14:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x15:
      cpu.zpxMode()
      cpu.ORA()
      cpu.clocks += 4
      break

    case 0x16:
      cpu.zpxMode()
      cpu.ASL()
      cpu.clocks += 6
      break

    case 0x17:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x18:
      cpu.impMode()
      cpu.CLC()
      cpu.clocks += 2
      break

    case 0x19:
      cpu.abyMode()
      cpu.ORA()
      cpu.clocks += 4
      break

    case 0x1a:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x1b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x1c:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x1d:
      cpu.abxMode()
      cpu.ORA()
      cpu.clocks += 4
      break

    case 0x1e:
      cpu.abxMode()
      cpu.ASL()
      cpu.clocks += 7
      break

    case 0x1f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x20:
      cpu.absMode()
      cpu.JSR()
      cpu.clocks += 6
      break

    case 0x21:
      cpu.izxMode()
      cpu.AND()
      cpu.clocks += 6
      break

    case 0x22:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x23:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x24:
      cpu.zp0Mode()
      cpu.BIT()
      cpu.clocks += 3
      break

    case 0x25:
      cpu.zp0Mode()
      cpu.AND()
      cpu.clocks += 3
      break

    case 0x26:
      cpu.zp0Mode()
      cpu.ROL()
      cpu.clocks += 5
      break

    case 0x27:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0x28:
      cpu.impMode()
      cpu.PLP()
      cpu.clocks += 4
      break

    case 0x29:
      cpu.immMode()
      cpu.AND()
      cpu.clocks += 2
      break

    case 0x2a:
      cpu.impMode()
      cpu.ROL()
      cpu.clocks += 2
      break

    case 0x2b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x2c:
      cpu.absMode()
      cpu.BIT()
      cpu.clocks += 4
      break

    case 0x2d:
      cpu.absMode()
      cpu.AND()
      cpu.clocks += 4
      break

    case 0x2e:
      cpu.absMode()
      cpu.ROL()
      cpu.clocks += 6
      break

    case 0x2f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x30:
      cpu.relMode()
      cpu.BMI()
      cpu.clocks += 2
      break

    case 0x31:
      cpu.izyMode()
      cpu.AND()
      cpu.clocks += 5
      break

    case 0x32:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x33:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x34:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x35:
      cpu.zpxMode()
      cpu.AND()
      cpu.clocks += 4
      break

    case 0x36:
      cpu.zpxMode()
      cpu.ROL()
      cpu.clocks += 6
      break

    case 0x37:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x38:
      cpu.impMode()
      cpu.SEC()
      cpu.clocks += 2
      break

    case 0x39:
      cpu.abyMode()
      cpu.AND()
      cpu.clocks += 4
      break

    case 0x3a:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x3b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x3c:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x3d:
      cpu.abxMode()
      cpu.AND()
      cpu.clocks += 4
      break

    case 0x3e:
      cpu.abxMode()
      cpu.ROL()
      cpu.clocks += 7
      break

    case 0x3f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x40:
      cpu.impMode()
      cpu.RTI()
      cpu.clocks += 6
      break

    case 0x41:
      cpu.izxMode()
      cpu.EOR()
      cpu.clocks += 6
      break

    case 0x42:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x43:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x44:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 3
      break

    case 0x45:
      cpu.zp0Mode()
      cpu.EOR()
      cpu.clocks += 3
      break

    case 0x46:
      cpu.zp0Mode()
      cpu.LSR()
      cpu.clocks += 5
      break

    case 0x47:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0x48:
      cpu.impMode()
      cpu.PHA()
      cpu.clocks += 3
      break

    case 0x49:
      cpu.immMode()
      cpu.EOR()
      cpu.clocks += 2
      break

    case 0x4a:
      cpu.impMode()
      cpu.LSR()
      cpu.clocks += 2
      break

    case 0x4b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x4c:
      cpu.absMode()
      cpu.JMP()
      cpu.clocks += 3
      break

    case 0x4d:
      cpu.absMode()
      cpu.EOR()
      cpu.clocks += 4
      break

    case 0x4e:
      cpu.absMode()
      cpu.LSR()
      cpu.clocks += 6
      break

    case 0x4f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x50:
      cpu.relMode()
      cpu.BVC()
      cpu.clocks += 2
      break

    case 0x51:
      cpu.izyMode()
      cpu.EOR()
      cpu.clocks += 5
      break

    case 0x52:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x53:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x54:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x55:
      cpu.zpxMode()
      cpu.EOR()
      cpu.clocks += 4
      break

    case 0x56:
      cpu.zpxMode()
      cpu.LSR()
      cpu.clocks += 6
      break

    case 0x57:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x58:
      cpu.impMode()
      cpu.CLI()
      cpu.clocks += 2
      break

    case 0x59:
      cpu.abyMode()
      cpu.EOR()
      cpu.clocks += 4
      break

    case 0x5a:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x5b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x5c:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x5d:
      cpu.abxMode()
      cpu.EOR()
      cpu.clocks += 4
      break

    case 0x5e:
      cpu.abxMode()
      cpu.LSR()
      cpu.clocks += 7
      break

    case 0x5f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x60:
      cpu.impMode()
      cpu.RTS()
      cpu.clocks += 6
      break

    case 0x61:
      cpu.izxMode()
      cpu.ADC()
      cpu.clocks += 6
      break

    case 0x62:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x63:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x64:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 3
      break

    case 0x65:
      cpu.zp0Mode()
      cpu.ADC()
      cpu.clocks += 3
      break

    case 0x66:
      cpu.zp0Mode()
      cpu.ROR()
      cpu.clocks += 5
      break

    case 0x67:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0x68:
      cpu.impMode()
      cpu.PLA()
      cpu.clocks += 4
      break

    case 0x69:
      cpu.immMode()
      cpu.ADC()
      cpu.clocks += 2
      break

    case 0x6a:
      cpu.impMode()
      cpu.ROR()
      cpu.clocks += 2
      break

    case 0x6b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x6c:
      cpu.indMode()
      cpu.JMP()
      cpu.clocks += 5
      break

    case 0x6d:
      cpu.absMode()
      cpu.ADC()
      cpu.clocks += 4
      break

    case 0x6e:
      cpu.absMode()
      cpu.ROR()
      cpu.clocks += 6
      break

    case 0x6f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x70:
      cpu.relMode()
      cpu.BVS()
      cpu.clocks += 2
      break

    case 0x71:
      cpu.izyMode()
      cpu.ADC()
      cpu.clocks += 5
      break

    case 0x72:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x73:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0x74:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x75:
      cpu.zpxMode()
      cpu.ADC()
      cpu.clocks += 4
      break

    case 0x76:
      cpu.zpxMode()
      cpu.ROR()
      cpu.clocks += 6
      break

    case 0x77:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x78:
      cpu.impMode()
      cpu.SEI()
      cpu.clocks += 2
      break

    case 0x79:
      cpu.abyMode()
      cpu.ADC()
      cpu.clocks += 4
      break

    case 0x7a:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x7b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x7c:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x7d:
      cpu.abxMode()
      cpu.ADC()
      cpu.clocks += 4
      break

    case 0x7e:
      cpu.abxMode()
      cpu.ROR()
      cpu.clocks += 7
      break

    case 0x7f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0x80:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x81:
      cpu.izxMode()
      cpu.STA()
      cpu.clocks += 6
      break

    case 0x82:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x83:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x84:
      cpu.zp0Mode()
      cpu.STY()
      cpu.clocks += 3
      break

    case 0x85:
      cpu.zp0Mode()
      cpu.STA()
      cpu.clocks += 3
      break

    case 0x86:
      cpu.zp0Mode()
      cpu.STX()
      cpu.clocks += 3
      break

    case 0x87:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 3
      break

    case 0x88:
      cpu.impMode()
      cpu.DEY()
      cpu.clocks += 2
      break

    case 0x89:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x8a:
      cpu.impMode()
      cpu.TXA()
      cpu.clocks += 2
      break

    case 0x8b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x8c:
      cpu.absMode()
      cpu.STY()
      cpu.clocks += 4
      break

    case 0x8d:
      cpu.absMode()
      cpu.STA()
      cpu.clocks += 4
      break

    case 0x8e:
      cpu.absMode()
      cpu.STX()
      cpu.clocks += 4
      break

    case 0x8f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x90:
      cpu.relMode()
      cpu.BCC()
      cpu.clocks += 2
      break

    case 0x91:
      cpu.izyMode()
      cpu.STA()
      cpu.clocks += 6
      break

    case 0x92:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0x93:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0x94:
      cpu.zpxMode()
      cpu.STY()
      cpu.clocks += 4
      break

    case 0x95:
      cpu.zpxMode()
      cpu.STA()
      cpu.clocks += 4
      break

    case 0x96:
      cpu.zpyMode()
      cpu.STX()
      cpu.clocks += 4
      break

    case 0x97:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0x98:
      cpu.impMode()
      cpu.TYA()
      cpu.clocks += 2
      break

    case 0x99:
      cpu.abyMode()
      cpu.STA()
      cpu.clocks += 5
      break

    case 0x9a:
      cpu.impMode()
      cpu.TXS()
      cpu.clocks += 2
      break

    case 0x9b:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0x9c:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0x9d:
      cpu.abxMode()
      cpu.STA()
      cpu.clocks += 5
      break

    case 0x9e:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0x9f:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0xa0:
      cpu.immMode()
      cpu.LDY()
      cpu.clocks += 2
      break

    case 0xa1:
      cpu.izxMode()
      cpu.LDA()
      cpu.clocks += 6
      break

    case 0xa2:
      cpu.immMode()
      cpu.LDX()
      cpu.clocks += 2
      break

    case 0xa3:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0xa4:
      cpu.zp0Mode()
      cpu.LDY()
      cpu.clocks += 3
      break

    case 0xa5:
      cpu.zp0Mode()
      cpu.LDA()
      cpu.clocks += 3
      break

    case 0xa6:
      cpu.zp0Mode()
      cpu.LDX()
      cpu.clocks += 3
      break

    case 0xa7:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 3
      break

    case 0xa8:
      cpu.impMode()
      cpu.TAY()
      cpu.clocks += 2
      break

    case 0xa9:
      cpu.immMode()
      cpu.LDA()
      cpu.clocks += 2
      break

    case 0xaa:
      cpu.impMode()
      cpu.TAX()
      cpu.clocks += 2
      break

    case 0xab:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xac:
      cpu.absMode()
      cpu.LDY()
      cpu.clocks += 4
      break

    case 0xad:
      cpu.absMode()
      cpu.LDA()
      cpu.clocks += 4
      break

    case 0xae:
      cpu.absMode()
      cpu.LDX()
      cpu.clocks += 4
      break

    case 0xaf:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xb0:
      cpu.relMode()
      cpu.BCS()
      cpu.clocks += 2
      break

    case 0xb1:
      cpu.izyMode()
      cpu.LDA()
      cpu.clocks += 5
      break

    case 0xb2:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xb3:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0xb4:
      cpu.zpxMode()
      cpu.LDY()
      cpu.clocks += 4
      break

    case 0xb5:
      cpu.zpxMode()
      cpu.LDA()
      cpu.clocks += 4
      break

    case 0xb6:
      cpu.zpyMode()
      cpu.LDX()
      cpu.clocks += 4
      break

    case 0xb7:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xb8:
      cpu.impMode()
      cpu.CLV()
      cpu.clocks += 2
      break

    case 0xb9:
      cpu.abyMode()
      cpu.LDA()
      cpu.clocks += 4
      break

    case 0xba:
      cpu.impMode()
      cpu.TSX()
      cpu.clocks += 2
      break

    case 0xbb:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xbc:
      cpu.abxMode()
      cpu.LDY()
      cpu.clocks += 4
      break

    case 0xbd:
      cpu.abxMode()
      cpu.LDA()
      cpu.clocks += 4
      break

    case 0xbe:
      cpu.abyMode()
      cpu.LDX()
      cpu.clocks += 4
      break

    case 0xbf:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xc0:
      cpu.immMode()
      cpu.CPY()
      cpu.clocks += 2
      break

    case 0xc1:
      cpu.izxMode()
      cpu.CMP()
      cpu.clocks += 6
      break

    case 0xc2:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xc3:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0xc4:
      cpu.zp0Mode()
      cpu.CPY()
      cpu.clocks += 3
      break

    case 0xc5:
      cpu.zp0Mode()
      cpu.CMP()
      cpu.clocks += 3
      break

    case 0xc6:
      cpu.zp0Mode()
      cpu.DEC()
      cpu.clocks += 5
      break

    case 0xc7:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0xc8:
      cpu.impMode()
      cpu.INY()
      cpu.clocks += 2
      break

    case 0xc9:
      cpu.immMode()
      cpu.CMP()
      cpu.clocks += 2
      break

    case 0xca:
      cpu.impMode()
      cpu.DEX()
      cpu.clocks += 2
      break

    case 0xcb:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xcc:
      cpu.absMode()
      cpu.CPY()
      cpu.clocks += 4
      break

    case 0xcd:
      cpu.absMode()
      cpu.CMP()
      cpu.clocks += 4
      break

    case 0xce:
      cpu.absMode()
      cpu.DEC()
      cpu.clocks += 6
      break

    case 0xcf:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0xd0:
      cpu.relMode()
      cpu.BNE()
      cpu.clocks += 2
      break

    case 0xd1:
      cpu.izyMode()
      cpu.CMP()
      cpu.clocks += 5
      break

    case 0xd2:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xd3:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0xd4:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xd5:
      cpu.zpxMode()
      cpu.CMP()
      cpu.clocks += 4
      break

    case 0xd6:
      cpu.zpxMode()
      cpu.DEC()
      cpu.clocks += 6
      break

    case 0xd7:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0xd8:
      cpu.impMode()
      cpu.CLD()
      cpu.clocks += 2
      break

    case 0xd9:
      cpu.abyMode()
      cpu.CMP()
      cpu.clocks += 4
      break

    case 0xda:
      cpu.impMode()
      cpu.NOP()
      cpu.clocks += 2
      break

    case 0xdb:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0xdc:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xdd:
      cpu.abxMode()
      cpu.CMP()
      cpu.clocks += 4
      break

    case 0xde:
      cpu.abxMode()
      cpu.DEC()
      cpu.clocks += 7
      break

    case 0xdf:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0xe0:
      cpu.immMode()
      cpu.CPX()
      cpu.clocks += 2
      break

    case 0xe1:
      cpu.izxMode()
      cpu.SBC()
      cpu.clocks += 6
      break

    case 0xe2:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xe3:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0xe4:
      cpu.zp0Mode()
      cpu.CPX()
      cpu.clocks += 3
      break

    case 0xe5:
      cpu.zp0Mode()
      cpu.SBC()
      cpu.clocks += 3
      break

    case 0xe6:
      cpu.zp0Mode()
      cpu.INC()
      cpu.clocks += 5
      break

    case 0xe7:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 5
      break

    case 0xe8:
      cpu.impMode()
      cpu.INX()
      cpu.clocks += 2
      break

    case 0xe9:
      cpu.immMode()
      cpu.SBC()
      cpu.clocks += 2
      break

    case 0xea:
      cpu.impMode()
      cpu.NOP()
      cpu.clocks += 2
      break

    case 0xeb:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xec:
      cpu.absMode()
      cpu.CPX()
      cpu.clocks += 4
      break

    case 0xed:
      cpu.absMode()
      cpu.SBC()
      cpu.clocks += 4
      break

    case 0xee:
      cpu.absMode()
      cpu.INC()
      cpu.clocks += 6
      break

    case 0xef:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0xf0:
      cpu.relMode()
      cpu.BEQ()
      cpu.clocks += 2
      break

    case 0xf1:
      cpu.izyMode()
      cpu.SBC()
      cpu.clocks += 5
      break

    case 0xf2:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 2
      break

    case 0xf3:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 8
      break

    case 0xf4:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xf5:
      cpu.zpxMode()
      cpu.SBC()
      cpu.clocks += 4
      break

    case 0xf6:
      cpu.zpxMode()
      cpu.INC()
      cpu.clocks += 6
      break

    case 0xf7:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 6
      break

    case 0xf8:
      cpu.impMode()
      cpu.SED()
      cpu.clocks += 2
      break

    case 0xf9:
      cpu.abyMode()
      cpu.SBC()
      cpu.clocks += 4
      break

    case 0xfa:
      cpu.impMode()
      cpu.NOP()
      cpu.clocks += 2
      break

    case 0xfb:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    case 0xfc:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 4
      break

    case 0xfd:
      cpu.abxMode()
      cpu.SBC()
      cpu.clocks += 4
      break

    case 0xfe:
      cpu.abxMode()
      cpu.INC()
      cpu.clocks += 7
      break

    case 0xff:
      cpu.impMode()
      cpu.XXX()
      cpu.clocks += 7
      break

    default:
      break
  }
}
