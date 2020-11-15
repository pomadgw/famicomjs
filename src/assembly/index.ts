// The entry file of your WebAssembly module.
import CPU from './cpu'
import PPU from './ppu'
import Bus from './bus'
import Cartridge from './cartridge'
import Bitfield from './utils/bitfield'
import Controller from './controller'
import { Button } from './controller'

export { Bus, CPU, PPU, Cartridge, Bitfield, Controller, Button }

export default function createNES(): Bus {
  const cpu = new CPU()
  const bus = new Bus(0x10000)
  cpu.connect(bus)
  bus.cpu = cpu

  // const a = new Bitfield([], new Uint32Array(1))

  return bus
}
