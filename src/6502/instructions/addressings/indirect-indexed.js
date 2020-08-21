export default function indirectIndexedMode(cpu) {
  const tableAddress = cpu.ram[cpu.nextPC()]

  const lo = cpu.ram[tableAddress]
  const hi = cpu.ram[tableAddress + 1]

  const absoluteAddress = ((hi << 8) | lo) + cpu.registers.Y

  return {
    absoluteAddress,
    clocks: (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }
}
