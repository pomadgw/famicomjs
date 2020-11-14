class BitfieldSize {
  public name: string
  public size: u8
}

export default class Bitfield {
  private _value: Uint32Array

  constructor(props: BitfieldSize[], value: Uint32Array) {
    this._value = value
  }

  get value(): u32 {
    return this._value[0]
  }

  set value(value: u32) {
    this._value[0] = value
  }
}
