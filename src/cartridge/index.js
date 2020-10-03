export default class Cartridge {
  constructor() {
    this.prgMemory = []
    this.chrMemory = []

    this.mapperId = 0
    this.prgBankNumber = 0
    this.chrBankNumber = 0
  }

  async parse(fileObj) {
    const reader = new FileReader()
    const data = await new Promise((resolve, reject) => {
      reader.addEventListener('load', (event) => {
        resolve(event.target.result)
      })

      reader.readAsArrayBuffer(fileObj)
    })
    const view = new Uint8Array(data)

    this.mapperId = ((view[7] >> 4) << 4) | (view[6] >> 4)
  }

  cpuRead(_addr) {
    return 0
  }

  cpuWrite(_addr, _value) {}

  ppuRead(_addr) {
    return 0
  }

  ppuWrite(_addr, _value) {}
}
