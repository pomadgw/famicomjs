export function ADC(cpu) {
  const carryBit = cpu.registers.STATUS.C ? 1 : 0
  let temp = cpu.registers.A + cpu.fetched + carryBit

  if (temp > 0xff) {
    cpu.registers.STATUS.C = true
  } else {
    cpu.registers.STATUS.C = false
  }

  temp = temp & 0xff

  cpu.registers.STATUS.N = (temp & 0x80) > 0
  cpu.registers.STATUS.Z = temp === 0

  const isOverflow =
    (~(cpu.registers.A ^ cpu.fetched) & (cpu.registers.A ^ temp) & 0x0080) > 0

  cpu.registers.STATUS.V = isOverflow
  cpu.registers.A = temp

  return 1
}

export function SBC(cpu) {
  const fetched = (cpu.fetched ^ 0xff) & 0xff
  const carryBit = cpu.registers.STATUS.C ? 1 : 0
  let temp = cpu.registers.A + fetched + carryBit

  if (temp > 0xff) {
    cpu.registers.STATUS.C = true
  } else {
    cpu.registers.STATUS.C = false
  }

  temp = temp & 0xff

  cpu.registers.STATUS.N = (temp & 0x80) > 0
  cpu.registers.STATUS.Z = temp === 0

  const isOverflow =
    (~(cpu.registers.A ^ fetched) & (cpu.registers.A ^ temp) & 0x0080) > 0

  cpu.registers.STATUS.V = isOverflow
  cpu.registers.A = temp & 0xff

  return 1
}
