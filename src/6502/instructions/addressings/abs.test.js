import absMode from './abs'
import CPU from '../../cpu'

describe('addressing mode: absolute', () => {
  it('should return correct value for absolute address', () => {
    const ram = [0, 0x0f, 0]
    const CPUDummy = new CPU(ram)
    expect(absMode(CPUDummy)).toEqual({ absoluteAddress: 0x0f00 })
  })
})
