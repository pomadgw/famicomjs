import absMode from './abs'
import CPU from '../../cpu'

describe('addressing mode: absolute', () => {
  it('should return correct value for absolute address', () => {
    const ram = [0, 0x0f, 0]
    const CPUDummy = new CPU(ram)
    expect(absMode(CPUDummy)).toEqual({ absoluteAddress: 0x0f00 })
  })

  it('should return correct value for indexed absolute address', () => {
    const ram = [0, 0x0f, 0]

    let CPUDummy = new CPU(ram)
    CPUDummy.registers.X = 0x01
    expect(absMode(CPUDummy, 'X')).toEqual({ absoluteAddress: 0x0f01 })

    CPUDummy = new CPU(ram)
    CPUDummy.registers.Y = 0x02
    expect(absMode(CPUDummy, 'Y')).toEqual({ absoluteAddress: 0x0f02 })
  })
})
