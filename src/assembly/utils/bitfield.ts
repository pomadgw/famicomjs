export class BitfieldSize {
  public name: string
  public size: u8

  constructor(name: string, size: u8) {
    this.size = size
    this.name = name
  }
}

class BitfieldSizeWihStartPos extends BitfieldSize {
  public startPos: u8

  constructor(name: string, size: u8, startPos: u8) {
    super(name, size)
    this.startPos = startPos
  }
}

export default class BitfieldTemplate {
  private _value: Uint32Array
  private _propsMap: Map<string, BitfieldSizeWihStartPos>

  constructor(props: BitfieldSize[], value: u32 = 0) {
    this._value = new Uint32Array(1)
    this._value[0] = value

    this._propsMap = new Map<string, BitfieldSizeWihStartPos>()

    let pos = 0
    for (let idx = 0; idx < props.length; idx++) {
      const prop = props[idx]
      const startPos = pos as u8
      const newProp: BitfieldSizeWihStartPos = new BitfieldSizeWihStartPos(
        prop.name,
        prop.size,
        startPos
      )

      this._propsMap.set(prop.name, newProp)
      pos += prop.size
    }
  }

  get value(): u32 {
    return this._value[0]
  }

  set value(value: u32) {
    this._value[0] = value
  }

  get(name: string): u32 {
    const prop = this._propsMap.get(name)
    return (this.value >> prop.startPos) & ((1 << prop.size) - 1)
  }

  getAsBoolean(name: string): bool {
    return this.get(name) === 1
  }

  set(name: string, value: u32): void {
    const prop = this._propsMap.get(name)
    const resetBits = (1 << prop.size) - 1
    const reset = ~(resetBits << prop.startPos)

    value = value & resetBits
    value = value << prop.startPos
    this.value = (this.value & reset) | value
  }

  setAsBoolean(name: string, value: bool): void {
    this.set(name, value ? 1 : 0)
  }
}
