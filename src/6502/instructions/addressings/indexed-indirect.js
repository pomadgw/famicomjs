export default function indexedIndirectMode(cpu) {
  const tableAddress = cpu.readRAM(cpu.nextPC())
  const lo = cpu.readRAM((tableAddress + cpu.registers.X) & 0xff)
  const hi = cpu.readRAM((tableAddress + cpu.registers.X + 1) & 0xff)

  const absoluteAddress = (hi << 8) | lo

  return {
    absoluteAddress,
    clocks: 0
  }
}
