import inxMode from './indexed-indirect'
import CPU from '../../cpu'

describe('addressing mode: indexed indirect', () => {
  it('should return correct value for absolute address', () => {
    // LDA ($01,X)
    // ram[$01] value: 0x01
    // Register X value: 0x02
    // Address of LSB of target: ram[0x01 + 0x02] = ram[0x03]
    // Address of MSB of target: ram[0x01 + 0x02 + 1] = ram[0x04]
    const ram = [0x00, 0x01, 0x00, 0x00, 0xf0]
    const CPUDummy = new CPU(ram)
    CPUDummy.nextPC()
    CPUDummy.registers.X = 0x02
    expect(inxMode(CPUDummy)).toEqual({ absoluteAddress: 0xf000, clocks: 0 })
  })
})
