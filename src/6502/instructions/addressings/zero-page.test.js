import zeroPage from './zero-page'
import CPU from '../../cpu'

describe('addressing mode: zero page', () => {
  it('should return correct value for zero page address', () => {
    const ram = [0x0f, 0]
    const CPUDummy = new CPU(ram)
    expect(zeroPage(CPUDummy)).toEqual({ absoluteAddress: 0x0f, clocks: 0 })
  })

  it('should return correct value for indexed zero page address', () => {
    const ram = [0x0f, 0]

    let CPUDummy = new CPU(ram)
    CPUDummy.registers.X = 0x01
    expect(zeroPage(CPUDummy, 'X')).toEqual({
      absoluteAddress: 0x10,
      clocks: 0
    })

    CPUDummy = new CPU(ram)
    CPUDummy.registers.Y = 0x02
    expect(zeroPage(CPUDummy, 'Y')).toEqual({
      absoluteAddress: 0x11,
      clocks: 0
    })
  })
})
