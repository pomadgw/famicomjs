export function ORA(cpu) {
  const result = cpu.registers.A | cpu.fetched
  cpu.registers.A = result
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = result > 0x80
}

export function AND(cpu) {
  const result = cpu.registers.A & cpu.fetched
  cpu.registers.A = result
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = result > 0x80
}
