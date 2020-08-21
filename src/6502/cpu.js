import RegisterStatus from './register'
import mapping from './instructions/index'

const proxyRAM = (ram) =>
  new Proxy(ram, {
    get(target, prop) {
      return target[prop]
    },
    set(target, prop, value) {
      if (typeof prop === 'number') target[prop] = value & 0xff
      else target[prop] = value
      return true
    }
  })

export default class CPU {
  constructor(ram) {
    this.ram = proxyRAM(ram)

    this.registers = new Proxy(
      {
        A: 0,
        X: 0,
        Y: 0,
        SP: 0,
        PC: 0,
        STATUS: RegisterStatus.create()
      },
      {
        set(target, prop, value) {
          if (prop === 'STATUS') target[prop] = value
          else target[prop] = value & 0xff
          return true
        }
      }
    )

    this.fetched = 0

    this.addresses = {
      absoluteAddress: 0,
      relativeAddress: 0
    }

    this.isImplicit = false
  }

  clock() {
    const opcode = this.readRAM(this.nextPC())
    this.operation = mapping[opcode]
    this.fetch(this.operation.addressing(this))
    this.operation.operator(this)
  }

  fetch({ absoluteAddress, value, relativeAddress } = {}) {
    this.isImplicit = value != null
    this.fetched = value ?? this.readRAM(absoluteAddress)
    this.addresses.absoluteAddress = absoluteAddress
    this.addresses.relativeAddress = relativeAddress
  }

  readRAM(address) {
    return this.ram[address]
  }

  nextPC() {
    return this.registers.PC++
  }
}
