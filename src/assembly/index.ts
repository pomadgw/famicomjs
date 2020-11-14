// The entry file of your WebAssembly module.
import CPU from './cpu'
import PPU from './ppu'
import Bus from './bus'
import Cartridge from './cartridge'
import Result from './utils/result'
import Bitfield from './utils/bitfield'

export { Bus, CPU, PPU, Cartridge, Result, Bitfield }

export default function createNES(): Bus {
  const bus = new Bus()
  const cpu = new CPU(bus)
  bus.cpu = cpu

  // const a = new Bitfield([], new Uint32Array(1))

  return bus
}
