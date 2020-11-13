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
    cpu.registers.Y = 0x02
    expect(inyMode(cpu)).toEqual({ absoluteAddress: 0x0203, clocks: 0 })
  })

  it('should return additional cycles if page is changed', () => {
    // LDA ($01),Y
    // LSB of target address: ram[$01] value: 0x01
    // MSB of target address: ram[$01 + 1] value: 0x02
    // Register Y value: 0xff
    // Target address: 0x0201 + 0xff = 0x0300
    const ram = [0x00, 0x01, 0x02, 0xf0, 0x00]
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
    cpu.registers.Y = 0xff
    expect(inyMode(cpu)).toEqual({ absoluteAddress: 0x0300, clocks: 1 })
  })
})
