import Bus from './index'
import CPU from '../6502/cpu'

describe('Bus', () => {
  it('should be able to be connected to CPU', () => {
    const cpudummy = {
      connect: jest.fn()
    }

    const bus = new Bus(cpudummy)

    expect(bus.cpu).toBe(cpudummy)
    expect(cpudummy.connect).toHaveBeenCalledWith(bus)
  })

  describe('Proxy RAM', () => {
    it('should mirror CPU RAM per 2KB', () => {
      const cpu = new CPU([])
      const bus = new Bus(cpu)

      bus.cpu.ram[0x0001] = 0x12
      expect(bus.cpu.ram[0x0801]).toBe(0x12)
      expect(bus.cpu.ram[0x1001]).toBe(0x12)
      expect(bus.cpu.ram[0x1801]).toBe(0x12)
    })
  })
})
