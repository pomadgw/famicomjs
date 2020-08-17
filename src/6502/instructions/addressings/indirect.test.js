import indirectMode from './indirect'
import CPU from '../../cpu'

describe('addressing mode: indirect', () => {
  it('should return correct value for specified constant', () => {
    const ram = [0x02, 0x00, 0x03, 0x04, 0, 0]
    const CPUDummy = new CPU(ram)
    expect(indirectMode(CPUDummy)).toEqual({ absoluteAddress: 0x0403 })
  })
})
