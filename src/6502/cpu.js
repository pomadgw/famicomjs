import RegisterStatus from './register'
import mapping from './instructions/index'

export default class CPU {
  constructor(ram) {
    this.ram = ram

    this.registers = {
      A: 0,
      X: 0,
      Y: 0,
      SP: 0,
      PC: 0,
      STATUS: RegisterStatus.create()
    }

    this.fetched = 0
  }

  clock() {
    const opcode = this.readRAM(this.nextPC())
    this.fetch(mapping[opcode].addressing(this))
    mapping[opcode].operator(this)
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
