export function BRK(cpu) {
  cpu.registers.PC += 1

  const pc = cpu.registers.PC

  cpu.pushStack((pc & 0xff00) >> 8)
  cpu.pushStack(pc & 0x00ff)

  cpu.registers.STATUS.I = true

  cpu.registers.STATUS.B = true
  cpu.pushStack(+cpu.registers.STATUS)
  cpu.registers.STATUS.B = false

  const newPCLo = cpu.ram[0xfffe]
  const newPCHi = cpu.ram[0xffff]

  cpu.registers.PC = (newPCHi << 8) | newPCLo

  return 0
}
