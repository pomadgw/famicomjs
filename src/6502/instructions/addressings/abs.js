export default function absMode(cpu) {
  const lo = cpu.ram[cpu.registers.PC]
  cpu.registers.PC += 1
  const hi = cpu.ram[cpu.registers.PC]

  return {
    absoluteAddress: (hi << 8) | lo
  }
}
