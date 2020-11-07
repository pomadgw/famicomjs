import createNES from '../../index'

describe('6502 CPU (wasm): addressing mode: immediate', () => {
  it('should return correct value for specified constant', () => {
    const bus = createNES()
    bus.ram = new Uint8Array([0x0f, 0x0f, 0])
    bus.cpu.clocks = 12

    bus.cpu.immMode()
    expect(bus.cpu.absoluteAddress).toBe(0x0000)
    expect(bus.cpu.clocks).toBe(12)

    bus.cpu.immMode()
    expect(bus.cpu.absoluteAddress).toBe(0x0001)
    expect(bus.cpu.clocks).toBe(12)
  })
})
