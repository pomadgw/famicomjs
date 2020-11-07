import createNES from '../../index'

describe('6502 CPU (wasm): addressing mode: absolute', () => {
  it('should return correct value for absolute address', () => {
    const bus = createNES()
    bus.ram = new Uint8Array([0x00, 0x0f, 0])
    bus.cpu.absMode()
    expect(bus.cpu).toEqual(
      expect.objectContaining({ absoluteAddress: 0x0f00, clocks: 0 })
    )
  })

  it('should return correct value for indexed absolute address', () => {
    const bus = createNES()
    bus.ram = new Uint8Array([0x00, 0x0f, 0])

    bus.cpu.X = 0x01
    bus.cpu.absXMode()
    expect(bus.cpu).toEqual(
      expect.objectContaining({ absoluteAddress: 0x0f01, clocks: 0 })
    )

    bus.cpu.PC = 0
    bus.cpu.Y = 0x02
    bus.cpu.absYMode()
    expect(bus.cpu).toEqual(
      expect.objectContaining({ absoluteAddress: 0x0f02, clocks: 0 })
    )
  })

  it('should return additional clock for indexed absolute address if page is changed', () => {
    const bus = createNES()
    bus.ram = new Uint8Array([0xff, 0x0f, 0])

    bus.cpu.X = 0x01
    bus.cpu.absXMode()
    expect(bus.cpu.clocks).toEqual(1)

    bus.cpu.PC = 0
    bus.cpu.clocks = 0
    bus.cpu.Y = 0x02
    bus.cpu.absYMode()
    expect(bus.cpu.clocks).toEqual(1)
  })
})
