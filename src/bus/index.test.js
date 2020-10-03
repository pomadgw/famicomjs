import Bus from './index'
import CPU from '../6502/cpu'
import PPU from '../ppu'

const createDummyCartridge = (defaultValue = false) => ({
  cpuRead: () => defaultValue,
  cpuWrite: () => defaultValue,
  ppuRead: () => defaultValue,
  ppuWrite: () => defaultValue
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
      bus.insertCartridge(createDummyCartridge(true))

      jest.spyOn(ppu, 'cpuRead')

      const data = bus.ram[0x2001]
      expect(data).toBe(0)
      expect(ppu.cpuRead).not.toHaveBeenCalled()
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
  })
})
