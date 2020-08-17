import RegisterStatus from './register'

export default class CPU {
  constructor(ram) {
    this.ram = ram

    this.registers = {
      A: 0,
      X: 0,
      Y: 0,
      SP: 0,
      PC: 0,
      STATUS: new RegisterStatus()
    }

    this.fetched = 0
  }

  fetch({ absoluteAddress, value, relativeAddress }) {
    this.fetched = value ?? this.readRAM(absoluteAddress)
  }

  readRAM(address) {
    return this.ram[address]
  }

  nextPC() {
    return this.registers.PC++
  }
}
