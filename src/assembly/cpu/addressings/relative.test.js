import createNES from '../../index'

describe('addressing mode: relative', () => {
  it('should return correct value for offset', () => {
    const ram = [0x0f, 0x0f, 0]
    const bus = createNES()
    bus.ram = new Uint8Array(ram)
    bus.cpu.nextPC()
    bus.cpu.rel()
    expect(bus.cpu.relativeAddress).toEqual(0x0f)
    expect(bus.cpu.clocks).toEqual(0)
  })

  it('should return correct value for offset (negative)', () => {
    const ram = [0x0f, 0xfa, 0]
    const expectOffset = 0xfa - 0x100
    const bus = createNES()
    bus.ram = new Uint8Array(ram)
    bus.cpu.nextPC()
    bus.cpu.rel()

    expect(bus.cpu.relativeAddress).toEqual(expectOffset)
  })
})
