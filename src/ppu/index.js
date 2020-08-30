export default class PPU {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}

  cpuRead(_addr) {
    return 0
  }

  cpuWrite(_addr, _value) {}

  ppuRead(_addr) {
    return 0
  }

  ppuWrite(_addr, _value) {}
}
