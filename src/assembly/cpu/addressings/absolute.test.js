import Bus from '../../bus'
import CPU from '../../cpu'

describe('6502 CPU (wasm): addressing mode: absolute', () => {
  it('should return correct value for absolute address', () => {
    const bus = new Bus()
    const CPUDummy = new CPU(bus)
    bus.ram = new Uint8Array([0x00, 0x0f, 0])
    CPUDummy.absMode()
    expect(CPUDummy).toEqual(
      expect.objectContaining({ absoluteAddress: 0x0f00, clocks: 0 })
    )
  })

  it('should return correct value for indexed absolute address', () => {
    const bus = new Bus()
    const CPUDummy = new CPU(bus)
    bus.ram = new Uint8Array([0x00, 0x0f, 0])

    CPUDummy.X = 0x01
    CPUDummy.absXMode()
    expect(CPUDummy).toEqual(
      expect.objectContaining({ absoluteAddress: 0x0f01, clocks: 0 })
    )

    CPUDummy.PC = 0
    CPUDummy.Y = 0x02
    CPUDummy.absYMode()
    expect(CPUDummy).toEqual(
      expect.objectContaining({ absoluteAddress: 0x0f02, clocks: 0 })
    )
  })

  it('should return additional clock for indexed absolute address if page is changed', () => {
    const bus = new Bus()
    const CPUDummy = new CPU(bus)
    bus.ram = new Uint8Array([0xff, 0x0f, 0])

    CPUDummy.X = 0x01
    CPUDummy.absXMode()
    expect(CPUDummy.clocks).toEqual(1)

    CPUDummy.PC = 0
    CPUDummy.clocks = 0
    CPUDummy.Y = 0x02
    CPUDummy.absYMode()
    expect(CPUDummy.clocks).toEqual(1)
  })
})
