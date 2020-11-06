import CPU from './cpu'

export default class Bus {
  public cpu: CPU | null

  constructor() {
    this.cpu = null
  }
}
