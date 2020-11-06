// The entry file of your WebAssembly module.
import CPU from './cpu'
import Bus from './bus'

export function add(a: i32, b: i32): i32 {
  return a + b;
}


export default function createNES(): Bus {
  const bus = new Bus()
  const cpu = new CPU(bus)
  bus.cpu = cpu

  return bus
}
