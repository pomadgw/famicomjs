export default function immediateMode(cpu) {
  return {
    value: cpu.ram[cpu.nextPC()],
    clocks: 0
  }
}
