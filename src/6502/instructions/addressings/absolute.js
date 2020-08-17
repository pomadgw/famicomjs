export default function absMode(cpu, index) {
  const lo = cpu.ram[cpu.nextPC()]
  const hi = cpu.ram[cpu.nextPC()]

  const offset = index ? cpu.registers[index] : 0

  return {
    absoluteAddress: ((hi << 8) | lo) + offset
  }
}
