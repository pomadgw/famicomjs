export default function indexedIndirectMode(cpu) {
  const tableAddress = cpu.ram[cpu.nextPC()]
  const lo = cpu.ram[tableAddress + cpu.registers.X]
  const hi = cpu.ram[tableAddress + cpu.registers.X + 1]

  const absoluteAddress = (hi << 8) | lo

  return {
    absoluteAddress,
    clocks: 0
  }
}
