export default function indirectMode(cpu) {
  const lo = cpu.ram[cpu.nextPC()]
  const hi = cpu.ram[cpu.nextPC()]

  const address = (hi << 8) | lo

  const actualLo = cpu.ram[address]
  const actualHi = cpu.ram[address + 1]

  return { absoluteAddress: (actualHi << 8) | actualLo }
}
