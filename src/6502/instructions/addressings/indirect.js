export default function indirectMode(cpu) {
  const lo = cpu.readRAM(cpu.nextPC())
  const hi = cpu.readRAM(cpu.nextPC())

  const pointer = (hi << 8) | lo

  const actualLo = cpu.readRAM(pointer)

  const pointerHi = lo === 0xff ? pointer & 0xff00 : pointer + 1
  const actualHi = cpu.readRAM(pointerHi)

  return { absoluteAddress: (actualHi << 8) | actualLo, clocks: 0 }
}
