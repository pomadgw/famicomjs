import createBus from '../createbus'
import { Flags } from '../flags'

const CPU = (ram) => {
  const bus = createBus()
  bus.ram = ram

  return bus.cpu
}

const generateArray = (len) => [...new Array(len)].map((_) => 0)

describe('instructions: interrupts', () => {
  describe('BRK', () => {
    let cpu
    const defaultPC = 0x4000
    let stackPosition

    beforeEach(() => {
      cpu = CPU(generateArray(0x10000))
      cpu.PC = defaultPC
      cpu.bus.ram[0xfffe] = 0x34
      cpu.bus.ram[0xffff] = 0x12
      stackPosition = cpu.SP
      cpu.fetch()
      cpu.STATUS.setStatus(Flags.I, false)
      cpu.BRK()
    })

    it('should toggle interrupt flag', () => {
      expect(cpu.STATUS.getStatus(Flags.I)).toBe(true)
    })

    it('should save PC', () => {
      expect(cpu.bus.ram[0x100 + stackPosition]).toBe(0x40)
      expect(cpu.bus.ram[0x100 + stackPosition - 1]).toBe(0x01)
    })

    it('should save status flags', () => {
      const expectedStatus = 0x24 | Flags.I | Flags.B | Flags.U
      expect(cpu.bus.ram[0x100 + stackPosition - 2]).toBe(expectedStatus)
    })

    it('should change PC to address as defined in 0xfffe & 0xffff', () => {
      expect(cpu.PC).toBe(0x1234)
    })
  })

  describe('RTI', () => {
    it('should restore saved PC in stack back to PC register correctly', () => {
      const cpu = CPU(generateArray(0x1000))
      cpu.PC = 0x1000

      cpu.bus.ram[0x1ff] = 0x12
      cpu.bus.ram[0x1fe] = 0x33
      cpu.bus.ram[0x1fd] = 0x33
      cpu.SP = 0xfc
      cpu.fetch()
      cpu.RTI()

      expect(cpu.PC).toBe(0x1233)
    })

    it('should restore saved status in stack back to status register correctly', () => {
      const status = 0b11111111
      const cpu = CPU(generateArray(0x1000))
      cpu.PC = 0x1000

      cpu.bus.ram[0x1ff] = 0x12
      cpu.bus.ram[0x1fe] = 0x33
      cpu.bus.ram[0x1fd] = status
      cpu.SP = 0xfc
      cpu.fetch()
      cpu.RTI()

      expect(+cpu.STATUS.status).toBe(0b11001111)
    })
  })
})
