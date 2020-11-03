export default function indirectIndexedMode(cpu) {
  const tableAddress = cpu.ram[cpu.nextPC()]

  const lo = cpu.ram[tableAddress & 0xff]
  const hi = cpu.ram[(tableAddress + 1) & 0xff]

  const absoluteAddress = (((hi << 8) | lo) + cpu.registers.Y) & 0xffff

  return {
    absoluteAddress,
    clocks: (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }
}
