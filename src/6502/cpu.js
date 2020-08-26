import RegisterStatus from './register'
import mapping from './instructions/index'
import { toUint8, toUint16 } from './utils'

export default class CPU {
  constructor(ram) {
    this.ram = new Uint8Array(ram)

    this.registers = new Proxy(
      {
        A: 0,
        X: 0,
        Y: 0,
        SP: 0xff,
        PC: 0,
        STATUS: RegisterStatus.create()
      },
      {
        set(target, prop, value) {
          if (prop === 'STATUS') target[prop] = value
          else if (prop === 'PC') target[prop] = toUint16(value)
          else target[prop] = toUint8(value)
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
    this.cycles = 0
    this.opcode = 0
  }

  clock() {
    while (this.cycles > 0) this.cycles -= 1
    this.atomicClock()
  }

  atomicClock() {
    if (this.cycles === 0) {
      const opcode = this.readRAM(this.nextPC())
      this.opcode = opcode
      this.operation = mapping[opcode]
      this.cycles = this.operation.cycles
      this.cycles += this.fetch(this.operation.addressing(this))
      this.cycles += this.operation.operator(this)
    }
  }

  fetch({ absoluteAddress, value, relativeAddress, clocks } = { clocks: 0 }) {
    this.isImplicit = value != null
    this.fetched = value ?? this.readRAM(absoluteAddress)
    this.addresses.absoluteAddress = absoluteAddress
    this.addresses.relativeAddress = relativeAddress

    return clocks
  }

  readRAM(address) {
    return this.ram[address]
  }

  nextPC() {
    return this.registers.PC++
  }

  pushStack(value) {
    this.ram[this.registers.SP + 0x100] = value
    this.registers.SP--
  }

  popStack() {
    this.registers.SP++
    const temp = this.ram[this.registers.SP + 0x100]

    return temp
  }
}
