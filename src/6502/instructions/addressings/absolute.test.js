import absMode from './absolute'
import CPU from '../../cpu'

describe('addressing mode: absolute', () => {
  it('should return correct value for absolute address', () => {
    const ram = [0, 0x0f, 0]
    const cpu = new CPU(ram)
    cpu.bus = {
      cpuRead(addr) {
        return cpu.ram[addr]
      },
      cpuWrite(addr, value) {
        cpu.ram[addr] = value
      }
    }
    expect(absMode(cpu)).toEqual({ absoluteAddress: 0x0f00, clocks: 0 })
  })

  it('should return correct value for indexed absolute address', () => {
    const ram = [0, 0x0f, 0]

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
    expect(absMode(cpu, 'X')).toEqual({
      absoluteAddress: 0x0f01,
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
    expect(absMode(cpu, 'Y')).toEqual({
      absoluteAddress: 0x0f02,
      clocks: 0
    })
  })

  it('should return additional clock for indexed absolute address if page is changed', () => {
    const ram = [0xff, 0x0f, 0]

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
    expect(absMode(cpu, 'X')).toEqual({
      absoluteAddress: 0x1000,
      clocks: 1
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
    expect(absMode(cpu, 'Y')).toEqual({
      absoluteAddress: 0x1001,
      clocks: 1
    })
  })
})
