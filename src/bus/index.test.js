import Bus from './index'
import CPU from '../6502/cpu'
import PPU from '../ppu'

const createDummyCartridge = (
  defaultReadValue = false,
  defaultWriteValue = false
) => ({
  cpuRead: () => defaultReadValue,
  cpuWrite: () => defaultWriteValue,
  ppuRead: () => defaultReadValue,
  ppuWrite: () => defaultWriteValue
})

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
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge(false))

      bus.ram[0x0001] = 0x12
      expect(bus.ram[0x0801]).toBe(0x12)
      expect(bus.ram[0x1001]).toBe(0x12)
      expect(bus.ram[0x1801]).toBe(0x12)
    })

    it('should cancel reading data if cartridge is handling it', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      const cart = createDummyCartridge(12, true)
      cart.ppuRead = () => true
      bus.insertCartridge(cart)

      jest.spyOn(ppu, 'cpuRead')

      const data = bus.ram[0x0001]
      expect(data).toBe(12)
    })

    it('should read data from PPU if address is 0x2000 - 0x3fff', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge(false))

      jest.spyOn(ppu, 'cpuRead')

      const data = bus.ram[0x2001]
      expect(data).toBe(0)
      expect(ppu.cpuRead).toHaveBeenCalledWith(1)
    })

    it('should write data to PPU if address is 0x2000 - 0x3fff', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge(false))

      jest.spyOn(ppu, 'cpuWrite')

      bus.ram[0x2008] = 0x10
      expect(ppu.cpuWrite).toHaveBeenCalledWith(0, 0x10)
    })

    it('should run correct function with this context', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge(false))

      bus.ram[0x0000] = 0x10
      expect(bus.ram.subarray(0, 1)[0]).toBe(0x10)
      expect(bus.ram.length).toBe(0x10000)
    })
  })

  it('should run clocks', () => {
    const cpu = new CPU([])
    const ppu = new PPU()
    const bus = new Bus(cpu, ppu)
    bus.insertCartridge(createDummyCartridge(false))

    jest.spyOn(bus.ppu, 'clock')
    jest.spyOn(bus.cpu, 'atomicClock')

    bus.clock()
    bus.clock()
    bus.clock()

    expect(bus.ppu.clock).toHaveBeenCalledTimes(3)
    expect(bus.cpu.atomicClock).toHaveBeenCalledTimes(1)
  })
})
