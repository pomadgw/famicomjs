import { FLAGS } from '../../register'

export function ORA(cpu) {
  cpu.fetch()
  const result = cpu.registers.A | cpu.fetched
  cpu.registers.A = result
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = result >= 0x80

  return 1
}

export function AND(cpu) {
  cpu.fetch()
  const result = cpu.registers.A & cpu.fetched
  cpu.registers.A = result
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = result >= 0x80

  return 1
}

export function EOR(cpu) {
  cpu.fetch()
  const result = cpu.registers.A ^ cpu.fetched
  cpu.registers.A = result
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = result >= 0x80

  return 1
}

export function ASL(cpu) {
  cpu.fetch()
  const temp = cpu.fetched << 1

  cpu.registers.STATUS.C = (temp & 0xff00) > 0
  cpu.registers.STATUS.Z = (temp & 0xff) === 0
  cpu.registers.STATUS.N = temp >= 0x80

  if (cpu.isImplicit) {
    cpu.registers.A = temp
  } else {
    cpu.ram[cpu.addresses.absoluteAddress] = temp
  }

  return 0
}

export function BIT(cpu) {
  cpu.fetch()
  const temp = cpu.fetched & cpu.registers.A
  cpu.registers.STATUS.Z = temp === 0

  cpu.registers.STATUS.N = (cpu.fetched & FLAGS.N) > 0
  cpu.registers.STATUS.V = (cpu.fetched & FLAGS.V) > 0

  return 0
}

export function LSR(cpu) {
  cpu.fetch()
  cpu.registers.STATUS.C = (cpu.fetched & 0x0001) === 1

  const result = (cpu.fetched >> 1) & 0xff

  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = (result & 0x80) > 0

  if (cpu.isImplicit) {
    cpu.registers.A = result
  } else {
    cpu.ram[cpu.addresses.absoluteAddress] = result
  }

  return 0
}

export function ROL(cpu) {
  cpu.fetch()
  const carryBit = cpu.registers.STATUS.C ? 1 : 0
  const result = ((cpu.fetched << 1) + carryBit) & 0xff

  cpu.registers.STATUS.C = (cpu.fetched & 0b10000000) > 0
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = (result & 0x80) > 0

  if (cpu.isImplicit) {
    cpu.registers.A = result
  } else {
    cpu.ram[cpu.addresses.absoluteAddress] = result
  }

  return 0
}

export function ROR(cpu) {
  cpu.fetch()
  const carryBit = cpu.registers.STATUS.C ? 1 : 0
  let result = (cpu.fetched >> 1) | (carryBit << 7)
  result = result & 0xff

  cpu.registers.STATUS.C = (cpu.fetched & 0x01) > 0
  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = (result & 0x80) > 0

  if (cpu.isImplicit) {
    cpu.registers.A = result
  } else {
    cpu.ram[cpu.addresses.absoluteAddress] = result
  }

  return 0
}
