export function ORA(cpu) {
  const result = cpu.registers.A | cpu.fetched
  cpu.registers.A = result
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = result > 0x80
}

export function AND(cpu) {
  const result = cpu.registers.A & cpu.fetched
  cpu.registers.A = result
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = result > 0x80
}

export function ASL(cpu) {
  const temp = cpu.registers.A << 1

  cpu.registers.STATUS.C = (temp & 0xff00) > 0
  cpu.registers.STATUS.Z = (temp & 0xff) === 0
  cpu.registers.STATUS.N = temp > 0x80

  if (cpu.isImplicit) {
    cpu.registers.A = temp
  } else {
    cpu.ram[cpu.addresses.absoluteAddress] = temp
  }
}
