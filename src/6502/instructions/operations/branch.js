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
