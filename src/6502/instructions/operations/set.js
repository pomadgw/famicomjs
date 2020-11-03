function setFlag(cpu, flag) {
  cpu.registers.STATUS[flag] = true
  return 0
}

export const SEC = (cpu) => setFlag(cpu, 'C')
export const SED = (cpu) => setFlag(cpu, 'D')
export const SEI = (cpu) => setFlag(cpu, 'I')
