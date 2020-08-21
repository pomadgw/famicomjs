export function BCC(cpu) {
  if (!cpu.registers.STATUS.C) {
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
