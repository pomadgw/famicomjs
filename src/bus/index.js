export default class Bus {
  constructor(cpu) {
    this.cpu = cpu

    this.cpu.connect(this)

    this.initVRAM()
  }

  initVRAM() {
    const cpuRAM = new Uint8Array(0x2000)

    const proxyRAM = new Proxy(cpuRAM, {
      get(target, prop) {
        if (isNaN(Number(prop))) return target[prop]

        // TODO:
        // Add routine for fetching data from cartridge
        // eslint-disable-next-line no-constant-condition
        if (false) return 0
        else if (prop < 0x2000) return target[prop & 0x07ff]
        else if (prop < 0x4000) return 0 // here return content of PPU
        return 0
      },
      set(target, prop, value) {
        if (isNaN(Number(prop))) target[prop] = value
        // TODO:
        // Add routine for fetching data writing status from cartridge
        // eslint-disable-next-line no-constant-condition
        else if (false) return 0
        else if (prop < 0x2000) target[prop & 0x07ff] = value
        else if (prop < 0x4000) {
          // here set content of PPU
        }

        return true
      }
    })

    this.cpu.ram = proxyRAM
  }
}
