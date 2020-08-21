import relativeMode from './relative'
import CPU from '../../cpu'

describe('addressing mode: relative', () => {
  it('should return correct value for offset', () => {
    const ram = [0x0f, 0x0f, 0]
    const CPUDummy = new CPU(ram)
    CPUDummy.nextPC()
    expect(relativeMode(CPUDummy)).toEqual({ relativeAddress: 0x0f, clocks: 0 })
  })

  it('should return correct value for offset (negative)', () => {
    const ram = [0x0f, 0xfa, 0]
    const expectOffset = 0xfa - 0x100
    const CPUDummy = new CPU(ram)
    CPUDummy.nextPC()
    expect(relativeMode(CPUDummy)).toEqual({
      relativeAddress: expectOffset,
      clocks: 0
    })
  })
})
