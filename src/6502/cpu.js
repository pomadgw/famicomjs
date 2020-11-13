import RegisterStatus from './register'
import mapping from './instructions/index'

export default class CPU {
  constructor(ram) {
    this.ram = new Uint8Array(ram)

    this.registers = new Proxy(
      {
        A: new Uint8Array([0]),
        X: new Uint8Array([0]),
        Y: new Uint8Array([0]),
        SP: new Uint8Array([0xff]),
        PC: new Uint16Array([0]),
        STATUS: RegisterStatus.create()
      },
      {
        get(target, prop) {
          if (prop === 'STATUS') return target[prop]
          return target[prop][0]
        },
        set(target, prop, value) {
          if (prop === 'STATUS') target[prop] = value
          else target[prop][0] = value
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

    this.bus = null

    this.debugCycles = -1
    this.debugCurrentOps = []
    this.debugCurrentOps.pc = this.registers.PC
  }

  connect(bus) {
    this.bus = bus
  }

  reset() {
    this.registers.A = 0
    this.registers.X = 0
    this.registers.Y = 0
    this.registers.SP = 0xfd

    this.registers.STATUS.status = 0
    this.registers.STATUS.U = true

    const startPCAddress = 0xfffc
    const loPC = this.readRAM(startPCAddress)
    const hiPC = this.readRAM(startPCAddress + 1)
    this.registers.PC = (hiPC << 8) | loPC
    this.debugCurrentOps.pc = this.registers.PC

    this.addresses.absoluteAddress = 0
    this.addresses.relativeAddress = 0
    this.fetched = 0

    this.cycles = 8
  }

  interrupt(targetAddress) {
    const { PC } = this.registers
    this.pushStack((PC >> 8) & 0xff)
    this.pushStack(PC & 0xff)

    this.registers.STATUS.B = false
    this.registers.STATUS.U = true
    this.registers.STATUS.I = true

    this.pushStack(+this.registers.STATUS)

    this.addresses.absoluteAddress = targetAddress

    const loPC = this.readRAM(targetAddress)
    const hiPC = this.readRAM(targetAddress + 1)
    this.registers.PC = (hiPC << 8) | loPC

    this.cycles = 7
  }

  irq() {
    if (this.registers.STATUS.I) {
      this.interrupt(0xfffe)
    }
  }

  nmi() {
    this.interrupt(0xfffa)
  }

  get isComplete() {
    return this.cycles === 0
  }

  clock() {
    do {
      this.atomicClock()
    } while (!this.isComplete)
  }

  atomicClock() {
    this.debugCycles += 1

    if (this.isComplete) {
      this.fetched = null
      const opcode = this.readRAM(this.nextPC())
      this.opcode = opcode
      this.operation = mapping[opcode]

      this.debugCurrentOps = [
        opcode,
        this.readRAM(this.registers.PC + 0),
        this.readRAM(this.registers.PC + 1)
      ]
      this.debugCurrentOps.pc = this.registers.PC - 1

      this.cycles = this.operation.cycles
      this.cycles += this.fetchAddress(this.operation.addressing(this))
      this.cycles += this.operation.operator(this)
    }

    this.cycles -= 1
  }

  fetchAddress(
    { absoluteAddress, value, relativeAddress, clocks } = { clocks: 0 }
  ) {
    this.isImplicit = value != null
    this.addresses.absoluteAddress = absoluteAddress & 0xffff
    this.addresses.relativeAddress = relativeAddress
    if (this.isImplicit) this.fetched = value

    return clocks
  }

  readRAM(address) {
    this.ram.isReadOnly = false
    const data = this.bus.cpuRead(address)
    return data
  }

  writeRAM(address, value) {
    this.bus.cpuWrite(address, value)
  }

  fetch() {
    if (!this.isImplicit)
      this.fetched = this.readRAM(this.addresses.absoluteAddress)
    return this.fetched
  }

  nextPC() {
    return this.registers.PC++
  }

  pushStack(value) {
    this.writeRAM(this.registers.SP + 0x100, value)
    this.registers.SP--
  }

  popStack() {
    this.registers.SP++
    const temp = this.readRAM(this.registers.SP + 0x100)

    return temp
  }
}
