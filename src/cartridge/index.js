export default class Cartridge {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    this.prgMemory = []
    this.chrMemory = []
  }

  readFile(file) {}

  cpuRead(_addr) {
    return 0
  }

  cpuWrite(_addr, _value) {}

  ppuRead(_addr) {
    return 0
  }

  ppuWrite(_addr, _value) {}
}
