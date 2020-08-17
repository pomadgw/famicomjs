export default function zeroPageMode(cpu, index) {
  const address = cpu.ram[cpu.nextPC()]
  const offset = index ? cpu.registers[index] : 0

  return { absoluteAddress: address + offset }
}
