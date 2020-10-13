import { FLAGS } from '../../register'

export function PHA(cpu) {
  cpu.pushStack(cpu.registers.A)
  return 0
}

export function PLA(cpu) {
  cpu.registers.A = cpu.popStack()
  cpu.registers.STATUS.N = cpu.registers.A >= 0x80
  cpu.registers.STATUS.Z = cpu.registers.A === 0
  return 0
}

export function PHP(cpu) {
  const statusToBePushed = +cpu.registers.STATUS | FLAGS.U | FLAGS.B

  cpu.registers.STATUS.U = false
  cpu.registers.STATUS.B = false

  cpu.pushStack(statusToBePushed)
  return 0
}

export function PLP(cpu) {
  const status = cpu.popStack()
  cpu.registers.STATUS.status = status
  cpu.registers.STATUS.U = true
  return 0
}

export function TXS(cpu) {
  cpu.registers.SP = cpu.registers.X
  return 0
}

export function TSX(cpu) {
  cpu.registers.X = cpu.registers.SP
  cpu.registers.STATUS.N = cpu.registers.X >= 0x80
  cpu.registers.STATUS.Z = cpu.registers.X === 0
  return 0
}
