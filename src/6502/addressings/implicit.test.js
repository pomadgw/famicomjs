import createBus from '../createbus'

describe('6502 CPU (wasm): addressing mode: implicit', () => {
  it('should return correct value for specified constant', () => {
    const bus = createBus()
    bus.ram = [0x0f, 0x0f, 0]
    bus.cpu.A = 0xff
    bus.cpu.impMode()
    expect(bus.cpu.fetchedData).toBe(0xff)
    expect(bus.cpu.clocks).toBe(0)
  })
})
