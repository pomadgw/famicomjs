// The entry file of your WebAssembly module.
import CPU from './cpu'
import PPU from './ppu'
import Bus from './bus'
import { NES } from './bus'
import Cartridge from './cartridge'
import Bitfield from './utils/bitfield'
import Screen from './utils/screen'
import Controller from './controller'
import { Button } from './controller'

export { Bus, NES, CPU, PPU, Cartridge, Bitfield, Controller, Button, Screen }

export const Uint8Array_ID = idof<Uint8Array>()

export default function createBus(): Bus {
  const cpu = new CPU()
  const bus = new Bus(0x10000)
  cpu.connect(bus)
  bus.cpu = cpu

  return bus
}

export function createNES(): Bus {
  const cpu = new CPU()
  const ppu = new PPU()
  const bus = new NES(cpu, ppu)
  cpu.connect(bus)

  return bus
}
