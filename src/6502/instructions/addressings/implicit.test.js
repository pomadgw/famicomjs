import impMode from './implicit'
import CPU from '../../cpu'

describe('addressing mode: implicit', () => {
  it('should return correct value for specified constant', () => {
    const ram = [0x0f, 0x0f, 0]
    const CPUDummy = new CPU(ram)
    CPUDummy.registers.A = 0xff
    expect(impMode(CPUDummy)).toEqual({ value: 0xff })
  })
})
