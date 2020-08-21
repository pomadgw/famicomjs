export default function implicitMode(cpu) {
  return {
    value: cpu.registers.A,
    clocks: 0
  }
}
