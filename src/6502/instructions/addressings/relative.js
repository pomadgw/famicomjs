export default function relativeMode(cpu) {
  let offset = cpu.readRAM(cpu.nextPC())
  if (offset > 0x7f) offset = offset - 0x100

  return {
    relativeAddress: offset,
    clocks: 0
  }
}
