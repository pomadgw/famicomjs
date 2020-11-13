import relativeMode from './relative'
import CPU from '../../cpu'

describe('addressing mode: relative', () => {
  it('should return correct value for offset', () => {
    const ram = [0x0f, 0x0f, 0]
    const cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    cpu.nextPC()
    expect(relativeMode(cpu)).toEqual({ relativeAddress: 0x0f, clocks: 0 })
  })

  it('should return correct value for offset (negative)', () => {
    const ram = [0x0f, 0xfa, 0]
    const expectOffset = 0xfa - 0x100
    const cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    cpu.nextPC()
    expect(relativeMode(cpu)).toEqual({
      relativeAddress: expectOffset,
      clocks: 0
    })
  })
})
