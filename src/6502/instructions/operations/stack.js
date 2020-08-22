export function PHA(cpu) {
  cpu.pushStack(cpu.registers.A)
  return 0
}

export function PLA(cpu) {
  cpu.registers.A = cpu.popStack()
  cpu.registers.STATUS.N = cpu.registers.A > 0x80
  cpu.registers.STATUS.Z = cpu.registers.A === 0
  return 0
}
