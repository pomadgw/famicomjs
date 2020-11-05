import RegisterStatus from './register'
import mapping from './instructions/index'

export default class CPU {
  constructor(ram) {
    this.ram = new Uint8Array(ram)
    this.isDebug = false

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
    this.setDebugData()
  }

  connect(bus) {
    this.bus = bus
  }

  setDebugData() {
    this.debugCycles = -1
    this.debugData = {
      /**
       * Format:
       * {
       *   pc: 0x0000,
       *   instructions: [0x00, 0x11],
       *   cycle: 0,
       * }
       */
      opcodes: [],
      pointer: -1,
      pc: this.registers.PC
    }
  }

  reset() {
    this.registers.A = 0
    this.registers.X = 0
    this.registers.Y = 0
    this.registers.SP = 0xfd

    this.registers.STATUS.status = 0x24

    const startPCAddress = 0xfffc
    const loPC = this.ram[startPCAddress]
    const hiPC = this.ram[startPCAddress + 1]
    this.registers.PC = (hiPC << 8) | loPC

    this.addresses.absoluteAddress = 0
    this.addresses.relativeAddress = 0
    this.fetched = 0

    this.cycles = 8
    this.setDebugData()
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

    const loPC = this.ram[targetAddress]
    const hiPC = this.ram[targetAddress + 1]
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

  get debugLastInstruction() {
    if (this.debugData.pointer === -1) return undefined
    return this.debugData.opcodes[this.debugData.pointer]
  }

  clock() {
    do {
      this.atomicClock()
    } while (!this.isComplete)
  }

  atomicClock() {
    if (this.isComplete) {
      this.fetched = null

      this.debugData.opcodes.push({
        pc: this.registers.PC,
        instructions: [],
        A: this.registers.A,
        X: this.registers.X,
        Y: this.registers.Y,
        P: +this.registers.STATUS,
        SP: this.registers.SP,
        cycles: this.debugCycles
      })
      this.debugData.pointer++

      const opcode = this.readRAM(this.nextPC())
      this.opcode = opcode
      this.operation = mapping[opcode]

      this.cycles = this.operation.cycles
      this.cycles += this.fetchAddress(this.operation.addressing(this))
      this.cycles += this.operation.operator(this)
    }

    this.debugCycles += 1
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
    const data = this.ram[address]
    return data
  }

  fetch() {
    if (!this.isImplicit)
      this.fetched = this.readRAM(this.addresses.absoluteAddress)
    return this.fetched
  }

  nextPC() {
    if (this.isDebug && this.debugData.pointer > -1) {
      const oldStatus = this.ram.isReadOnly
      this.ram.isReadOnly = true
      this.debugLastInstruction.instructions.push(this.ram[this.registers.PC])

      this.ram.isReadOnly = oldStatus
    }

    return this.registers.PC++
  }

  pushStack(value) {
    this.ram[this.registers.SP + 0x100] = value
    this.registers.SP--

    if (this.debugLastInstruction?.valueToWrite != null) {
      delete this.debugLastInstruction.valueToWrite
    }
  }

  popStack() {
    this.registers.SP++
    const temp = this.ram[this.registers.SP + 0x100]

    return temp
  }
}
