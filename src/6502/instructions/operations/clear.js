function clearFlag(cpu, flag) {
  cpu.registers.STATUS[flag] = false
  return 0
}

export const CLC = (cpu) => clearFlag(cpu, 'C')
export const CLD = (cpu) => clearFlag(cpu, 'D')
export const CLI = (cpu) => clearFlag(cpu, 'I')
export const CLV = (cpu) => clearFlag(cpu, 'V')
