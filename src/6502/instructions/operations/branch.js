function jumpIfTrue(cpu, condition) {
  if (condition) {
    cpu.cycles += 1
    cpu.addresses.absoluteAddress =
      cpu.addresses.relativeAddress + cpu.registers.PC

    if (
      (cpu.addresses.absoluteAddress & 0xff00) !==
      (cpu.registers.PC & 0xff00)
    ) {
      cpu.cycles += 1
    }

    cpu.registers.PC = cpu.addresses.absoluteAddress
  }

  return 0
}

export const BCC = (cpu) => jumpIfTrue(cpu, !cpu.registers.STATUS.C)
export const BCS = (cpu) => jumpIfTrue(cpu, cpu.registers.STATUS.C)
export const BEQ = (cpu) => jumpIfTrue(cpu, cpu.registers.STATUS.Z)
export const BNE = (cpu) => jumpIfTrue(cpu, !cpu.registers.STATUS.Z)
export const BMI = (cpu) => jumpIfTrue(cpu, cpu.registers.STATUS.N)
export const BPL = (cpu) => jumpIfTrue(cpu, !cpu.registers.STATUS.N)
export const BVS = (cpu) => jumpIfTrue(cpu, cpu.registers.STATUS.V)
export const BVC = (cpu) => jumpIfTrue(cpu, !cpu.registers.STATUS.V)

export function JMP(cpu) {
  cpu.registers.PC = cpu.addresses.absoluteAddress
  return 0
}
