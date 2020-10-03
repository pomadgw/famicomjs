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

    const mapper1 = view[6]
    const mapper2 = view[7]

    this.mapperId = ((mapper2 >> 4) << 4) | (mapper1 >> 4)
    console.log(this.mapperId)

    let seekPosition = 16

    if ((mapper1 & 0x04) > 0) {
      seekPosition += 512
    }

    const nFileType = 1

    if (nFileType === 0) {
    } else if (nFileType === 1) {
      this.prgBankNumber = view[4]
      this.chrBankNumber = view[5]
      this.prgMemory = view.slice(
        seekPosition,
        seekPosition + this.prgBankNumber * 16384
      )
      seekPosition += this.prgBankNumber * 16384
      this.chrMemory = view.slice(
        seekPosition,
        seekPosition + this.chrBankNumber * 8192
      )
    } else if (nFileType === 2) {
    }
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
