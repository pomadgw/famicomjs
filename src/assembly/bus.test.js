import { NES as Bus } from './bus'
import CPU from './cpu'
import PPU from './ppu'

const createDummyCartridge = (
  defaultReadValue = { value: 0, error: true },
  defaultWriteValue = { value: 0, error: true }
) => ({
  cpuRead: () => defaultReadValue,
  cpuWrite: () => defaultWriteValue,
  ppuRead: () => defaultReadValue,
  ppuWrite: () => defaultWriteValue
})

describe('Aseembly: Bus', () => {
  it('should be able to be connected to CPU', () => {
    const cpu = new CPU([])
    const ppu = new PPU()
    jest.spyOn(cpu, 'connect')

    const bus = new Bus(cpu, ppu)

    expect(bus.cpu).toEqual(cpu)
    expect(cpu.connect).toHaveBeenCalledWith(bus)
  })

  describe('Proxy RAM', () => {
    it('should mirror CPU RAM per 2KB', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge({ value: 0, error: true }))

      bus.cpuWrite(0x0001, 0x12)
      expect(bus.cpuRead(0x0801)).toBe(0x12)
      expect(bus.cpuRead(0x1001)).toBe(0x12)
      expect(bus.cpuRead(0x1801)).toBe(0x12)
    })

    it('should cancel reading data if cartridge is handling it', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      const cart = createDummyCartridge(
        { value: 12, error: false },
        { value: 0, error: false }
      )
      cart.ppuRead = () => true
      bus.insertCartridge(cart)

      jest.spyOn(ppu, 'cpuRead')

      const data = bus.cpuRead(0x0001)
      expect(data).toBe(12)
    })

    it('should read data from PPU if address is 0x2000 - 0x3fff', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge({ value: 0, error: true }))

      jest.spyOn(ppu, 'cpuRead')

      const data = bus.cpuRead(0x2001)
      expect(data).toBe(0)
      expect(ppu.cpuRead).toHaveBeenCalledWith(1, false)
    })

    it('should write data to PPU if address is 0x2000 - 0x3fff', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge(null))

      jest.spyOn(ppu, 'cpuWrite')

      bus.cpuWrite(0x2008, 0x10)
      expect(ppu.cpuWrite).toHaveBeenCalledWith(0, 0x10)
    })

    it('should read data to controller if address is 0x4016 or 0x4017', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge({ value: 0, error: true }))

      bus.controllers[0].strobe = 0
      bus.controllers[0].buttonStatus = 0x01
      bus.controllers[1].strobe = 0
      bus.controllers[1].buttonStatus = 0x0f

      jest.spyOn(bus.controllers[0], 'read')
      jest.spyOn(bus.controllers[1], 'read')

      let data = bus.cpuRead(0x4016)
      expect(data).toBe(1)
      expect(bus.controllers[0].read).toHaveBeenCalled()
      data = bus.cpuRead(0x4017)
      expect(data).toBe(1)
      expect(bus.controllers[1].read).toHaveBeenCalled()
    })

    it('should write data to controller if address is 0x4016 or 0x4017', () => {
      const cpu = new CPU([])
      const ppu = new PPU()
      const bus = new Bus(cpu, ppu)
      bus.insertCartridge(createDummyCartridge(null))

      jest.spyOn(bus.controllers[0], 'write')
      jest.spyOn(bus.controllers[1], 'write')

      bus.cpuWrite(0x4016, 0x01)
      expect(bus.controllers[0].write).toHaveBeenCalledWith(0x01)
      bus.cpuWrite(0x4017, 0x11)
      expect(bus.controllers[1].write).toHaveBeenCalledWith(0x11)
    })
  })

  it('should run clocks', () => {
    const cpu = new CPU([])
    const ppu = new PPU()
    const onRender = jest.fn()
    const bus = new Bus(cpu, ppu, { onRender })
    bus.insertCartridge(createDummyCartridge({ value: 0, error: true }))

    jest.spyOn(bus.ppu, 'clock')
    jest.spyOn(bus.cpu, 'clock')

    bus.clock()
    bus.clock()

    ppu.isFrameComplete = true
    bus.clock()

    expect(bus.ppu.clock).toHaveBeenCalledTimes(3)
    expect(bus.cpu.clock).toHaveBeenCalledTimes(1)
  })

  it('should run nmi interrupt if ppu nmi is enabled', () => {
    const cpu = new CPU([])
    const ppu = new PPU()
    const onRender = jest.fn()
    const bus = new Bus(cpu, ppu, { onRender })
    bus.insertCartridge(createDummyCartridge({ value: 0, error: true }))

    jest.spyOn(bus.cpu, 'nmi')

    ppu.nmi = true

    bus.clock()

    expect(bus.ppu.nmi).toBe(false)
    expect(bus.cpu.nmi).toHaveBeenCalled()
  })
})