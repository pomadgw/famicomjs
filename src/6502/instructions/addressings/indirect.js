export default function indirectMode(cpu) {
  const lo = cpu.ram[cpu.nextPC()]
  const hi = cpu.ram[cpu.nextPC()]

  const pointer = (hi << 8) | lo

  const actualLo = cpu.ram[pointer]

  const pointerHi = lo === 0xff ? pointer & 0xff00 : pointer + 1
  const actualHi = cpu.ram[pointerHi]

  return { absoluteAddress: (actualHi << 8) | actualLo }
}
