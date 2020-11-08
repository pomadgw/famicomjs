// The entry file of your WebAssembly module.
import CPU from './cpu'
import Bus from './bus'

export {
  Bus,
  CPU
}

export default function createNES(): Bus {
  const bus = new Bus()
  const cpu = new CPU(bus)
  bus.cpu = cpu

  return bus
}
