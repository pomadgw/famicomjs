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

export function DEC(cpu) {
  const fetched = cpu.fetched

  const result = (fetched - 1) & 0xff

  cpu.ram[cpu.addresses.absoluteAddress] = result

  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = (result & 0x80) > 0

  return 0
}

function decreaseRegisterValue(cpu, register) {
  const fetched = cpu.registers[register]

  const result = (fetched - 1) & 0xff

  cpu.registers[register] = result

  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = (result & 0x80) > 0

  return 0
}

export const DEX = (cpu) => decreaseRegisterValue(cpu, 'X')
export const DEY = (cpu) => decreaseRegisterValue(cpu, 'Y')

export function INC(cpu) {
  const fetched = cpu.fetched

  const result = (fetched + 1) & 0xff

  cpu.ram[cpu.addresses.absoluteAddress] = result

  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = (result & 0x80) > 0

  return 0
}

function increaseRegisterValue(cpu, register) {
  const fetched = cpu.registers[register]

  const result = (fetched + 1) & 0xff

  cpu.registers[register] = result

  cpu.registers.STATUS.Z = result === 0
  cpu.registers.STATUS.N = (result & 0x80) > 0

  return 0
}

export const INX = (cpu) => increaseRegisterValue(cpu, 'X')
export const INY = (cpu) => increaseRegisterValue(cpu, 'Y')
