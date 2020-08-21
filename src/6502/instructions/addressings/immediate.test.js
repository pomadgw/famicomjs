import immMode from './immediate'
import CPU from '../../cpu'

describe('addressing mode: immediate', () => {
  it('should return correct value for specified constant', () => {
    const ram = [0x0f, 0x0f, 0]
    const CPUDummy = new CPU(ram)
    expect(immMode(CPUDummy)).toEqual({ value: 0x0f, clocks: 0 })
  })
})
