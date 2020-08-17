import inyMode from './indirect-indexed'
import CPU from '../../cpu'

describe('addressing mode: indirect indexed', () => {
  it('should return correct value for absolute address', () => {
    // LDA ($01),Y
    // LSB of target address: ram[$01] value: 0x01
    // MSB of target address: ram[$01 + 1] value: 0x02
    // Register Y value: 0x02
    // Target address: 0x0201 + 0x02 = 0x0203
    const ram = [0x00, 0x01, 0x02, 0xf0, 0x00]
    const CPUDummy = new CPU(ram)
    CPUDummy.nextPC()
    CPUDummy.registers.Y = 0x02
    expect(inyMode(CPUDummy)).toEqual({ absoluteAddress: 0x0203 })
  })
})
