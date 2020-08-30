export default class Bus {
  constructor(cpu, ppu) {
    this.cpu = cpu
    this.ppu = ppu

    this.cpu.connect(this)

    this.initVRAM()
  }

  initVRAM() {
    const cpuRAM = new Uint8Array(0x2000)

    const proxyRAM = new Proxy(cpuRAM, {
      get: (target, prop) => {
        const address = Number(prop)
        if (isNaN(address)) return target[prop]

        // TODO:
        // Add routine for fetching data from cartridge
        // eslint-disable-next-line no-constant-condition
        if (false) return 0
        else if (address < 0x2000) return target[address & 0x07ff]
        else if (address < 0x4000) return this.ppu.cpuRead(address & 0x0007)
        return 0
      },
      set: (target, prop, value) => {
        const address = Number(prop)
        if (isNaN(address)) target[prop] = value
        // TODO:
        // Add routine for fetching data writing status from cartridge
        // eslint-disable-next-line no-constant-condition
        else if (false) return 0
        else if (address < 0x2000) target[prop & 0x07ff] = value
        else if (address < 0x4000) {
          this.ppu.cpuWrite(address & 0x0007, value)
        }

        return true
      }
    })

    this.cpu.ram = proxyRAM
    this.ram = proxyRAM
  }
}
