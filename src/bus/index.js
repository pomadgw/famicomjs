export default class Bus {
  constructor(cpu) {
    this.cpu = cpu

    this.cpu.connect(this)
  }
}
