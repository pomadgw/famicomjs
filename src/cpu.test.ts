import Bus from './bus'
import CPU from './cpu'

describe('CPU', () => {
  it('should set correct CPU states when resetted', () => {
    const cpu = new CPU()
    const bus = new Bus()

    bus.ram[0xfffc] = 0x12
    bus.ram[0xfffd] = 0x34

    cpu.reset()

    do {
      cpu.clock(bus)
    } while (!cpu.sync)

    expect(cpu.cycles).toBe(7)
    expect(cpu.PC).toBe(0x3412)
  })
})
