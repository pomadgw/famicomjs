export function TAX(cpu) {
  cpu.registers.X = cpu.registers.A

  cpu.registers.STATUS.Z = cpu.registers.X === 0
  cpu.registers.STATUS.N = (cpu.registers.X & 0x80) > 0

  return 0
}

export function TAY(cpu) {
  cpu.registers.Y = cpu.registers.A

  cpu.registers.STATUS.Z = cpu.registers.Y === 0
  cpu.registers.STATUS.N = (cpu.registers.Y & 0x80) > 0

  return 0
}

export function TXA(cpu) {
  cpu.registers.A = cpu.registers.X

  cpu.registers.STATUS.Z = cpu.registers.A === 0
  cpu.registers.STATUS.N = (cpu.registers.A & 0x80) > 0

  return 0
}

export function TYA(cpu) {
  cpu.registers.A = cpu.registers.Y

  cpu.registers.STATUS.Z = cpu.registers.A === 0
  cpu.registers.STATUS.N = (cpu.registers.A & 0x80) > 0
  return 0
}
