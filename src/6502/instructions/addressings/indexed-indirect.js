export default function indexedIndirectMode(cpu) {
  const tableAddress = cpu.ram[cpu.nextPC()]
  const lo = cpu.ram[(tableAddress + cpu.registers.X) & 0xff]
  const hi = cpu.ram[(tableAddress + cpu.registers.X + 1) & 0xff]

  const absoluteAddress = (hi << 8) | lo

  return {
    absoluteAddress,
    clocks: 0
  }
}
