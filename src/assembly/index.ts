// The entry file of your WebAssembly module.

export function add(a: i32, b: i32): i32 {
  return a + b;
}

export class Bus {
  public cpu: CPU | null

  constructor() {
    this.cpu = null
  }
}

export class CPU {
  private bus: Bus

  constructor(bus: Bus) {
    this.bus = bus
  }
}

export default function createNES(): Bus {
  const bus = new Bus()
  const cpu = new CPU(bus)
  bus.cpu = cpu

  return bus
}
