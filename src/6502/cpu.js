import RegisterStatus from './RegisterStatus'

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
  }

  nextPC() {
    return this.registers.PC++
  }
}
