function compare(cpu, register) {
  cpu.fetch()
  const temp = cpu.registers[register] - cpu.fetched

  cpu.registers.STATUS.C = temp >= 0
  cpu.registers.STATUS.Z = temp === 0
  cpu.registers.STATUS.N = temp < 0 || temp >= 0x80

  return 1
}

export const CMP = (cpu) => compare(cpu, 'A')
export const CPX = (cpu) => compare(cpu, 'X')
export const CPY = (cpu) => compare(cpu, 'Y')
