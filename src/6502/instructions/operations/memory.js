function loadToRegister(cpu, register) {
  const content = cpu.fetched

  cpu.registers[register] = content
  cpu.registers.STATUS.N = content > 0x80
  cpu.registers.STATUS.Z = content === 0

  return 0
}

function saveFromRegisters(cpu, register) {
  cpu.ram[cpu.addresses.absoluteAddress] = cpu.registers[register]
  return 0
}

export const LDA = (cpu) => loadToRegister(cpu, 'A')
export const LDX = (cpu) => loadToRegister(cpu, 'X')
export const LDY = (cpu) => loadToRegister(cpu, 'Y')

export const STA = (cpu) => saveFromRegisters(cpu, 'A')
export const STX = (cpu) => saveFromRegisters(cpu, 'X')
export const STY = (cpu) => saveFromRegisters(cpu, 'Y')
