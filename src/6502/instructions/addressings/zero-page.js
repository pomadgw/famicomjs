export default function zeroPageMode(cpu, index) {
  const address = cpu.readRAM(cpu.nextPC())
  const offset = index ? cpu.registers[index] : 0

  return { absoluteAddress: (address + offset) & 0xff, clocks: 0 }
}
