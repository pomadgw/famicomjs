export default function immediateMode(cpu) {
  return {
    absoluteAddress: cpu.nextPC(),
    clocks: 0
  }
}
