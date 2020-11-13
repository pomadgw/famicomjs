import indirectMode from './indirect'
import CPU from '../../cpu'

describe('addressing mode: indirect', () => {
  it('should return correct value for specified constant', () => {
    const ram = [0x02, 0x00, 0x03, 0x04, 0, 0]
    const cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    expect(indirectMode(cpu)).toEqual({
      absoluteAddress: 0x0403,
      clocks: 0
    })
  })

  it('should return correct value for constant ending with LSB 0xff', () => {
    const ram = [...new Array(2 * 1024)].map((_) => 0)
    ram[0] = 0xff
    ram[1] = 0x10
    ram[0x10ff] = 0x10
    ram[0x1000] = 0x10

    // bug in JMP instruction resulting in
    // pointer of MSB from 0x1000 (instead of 0x1100) nad LSB 0x10FF

    const cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    expect(indirectMode(cpu)).toEqual({
      absoluteAddress: 0x1010,
      clocks: 0
    })
  })
})
