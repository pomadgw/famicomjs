export default function absMode(cpu, index) {
  const lo = cpu.readRAM(cpu.nextPC())
  const hi = cpu.readRAM(cpu.nextPC())

  const offset = index ? cpu.registers[index] : 0
  const absoluteAddress = ((hi << 8) | lo) + offset

  return {
    absoluteAddress,
    clocks: index && (absoluteAddress & 0xff00) !== hi << 8 ? 1 : 0
  }
}
