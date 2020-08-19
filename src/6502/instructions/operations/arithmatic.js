export function ADC(cpu) {
  const carryBit = cpu.registers.STATUS.C ? 1 : 0
  let temp = cpu.registers.A + cpu.fetched + carryBit

  if (temp > 0xff) {
    temp -= 0x100
    cpu.registers.STATUS.C = true
  }

  cpu.registers.STATUS.N = (temp & 0x80) > 0
  cpu.registers.STATUS.Z = temp === 0

  const isOverflow =
    (~(cpu.registers.A ^ cpu.fetched) & (cpu.registers.A ^ temp) & 0x0080) > 0

  cpu.registers.STATUS.V = isOverflow
  cpu.registers.A = temp
}

export function SUB(cpu) {}
