import zeroPage from './zero-page'
import CPU from '../../cpu'

describe('addressing mode: zero page', () => {
  it('should return correct value for zero page address', () => {
    const ram = [0x0f, 0]
    const cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    expect(zeroPage(cpu)).toEqual({ absoluteAddress: 0x0f, clocks: 0 })
  })

  it('should return correct value for indexed zero page address', () => {
    const ram = [0x0f, 0]

    let cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    cpu.registers.X = 0x01
    expect(zeroPage(cpu, 'X')).toEqual({
      absoluteAddress: 0x10,
      clocks: 0
    })

    cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    cpu.registers.Y = 0x02
    expect(zeroPage(cpu, 'Y')).toEqual({
      absoluteAddress: 0x11,
      clocks: 0
    })

    cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    cpu.registers.Y = 0xf1
    expect(zeroPage(cpu, 'Y')).toEqual({
      absoluteAddress: 0x00,
      clocks: 0
    })
  })
})
