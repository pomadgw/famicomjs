import createNES from '../../index'

const createCPU = () => {
  const bus = createNES()
  bus.ram = [0x0f, 0]

  return bus.cpu
}

describe('addressing mode: zero page', () => {
  it('should return correct value for zero page address', () => {
    const CPUDummy = createCPU()
    CPUDummy.zp0Mode()
    expect(CPUDummy.absoluteAddress).toBe(0x0f)
    expect(CPUDummy.clocks).toBe(0)
  })

  it('should return correct value for indexed zero page address', () => {
    let CPUDummy = createCPU()
    CPUDummy.X = 0x01
    CPUDummy.zpxMode()
    expect(CPUDummy.absoluteAddress).toBe(0x10)
    expect(CPUDummy.clocks).toBe(0)

    CPUDummy = createCPU()
    CPUDummy.Y = 0x02
    CPUDummy.zpyMode()
    expect(CPUDummy.absoluteAddress).toBe(0x11)
    expect(CPUDummy.clocks).toBe(0)
  })

  it('should wrap the address', () => {
    let CPUDummy = createCPU()
    CPUDummy.X = 0xf1
    CPUDummy.zpxMode()
    expect(CPUDummy.absoluteAddress).toBe(0x00)

    CPUDummy = createCPU()
    CPUDummy.Y = 0xf1
    CPUDummy.zpyMode()
    expect(CPUDummy.absoluteAddress).toBe(0x00)
  })
})
