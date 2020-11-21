import MapperMMC1 from './001'

function shift(mapper, x, target) {
  mapper.cpuMapWrite(0x8001, x)
  x >>= 1
  mapper.cpuMapWrite(0x8001, x)
  x >>= 1
  mapper.cpuMapWrite(0x8001, x)
  x >>= 1
  mapper.cpuMapWrite(0x8001, x)
  x >>= 1
  mapper.cpuMapWrite(target, x)
  x >>= 1
}

describe('mapper: mmc1', () => {
  it('should be able to transfer data to control reg', () => {
    const mapper = new MapperMMC1(1, 1)
    const x = 0x1f
    shift(mapper, x, 0x8001)
    expect(mapper.controlReg).toBe(0x1f)
  })

  it('should be able to set 4kb lower chr bank or 8kb chr bank', () => {
    const mapper = new MapperMMC1(1, 1)
    mapper.controlReg |= 0b0001_0000

    let x = 0x08
    shift(mapper, x, 0xa001)
    expect(mapper.chrRom4k0BankNumber).toBe(0x08)

    mapper.controlReg ^= 0b0001_0000

    x = 0x08
    shift(mapper, x, 0xa001)
    expect(mapper.chrRom8kBankNumber).toBe((0x08 & 0x1e) >> 1)
  })

  it('should be able to set 4kb upper chr bank', () => {
    const mapper = new MapperMMC1(1, 1)
    mapper.controlReg |= 0b0001_0000

    const x = 0x08
    shift(mapper, x, 0xc001)
    expect(mapper.chrRom4k1BankNumber).toBe(0x08)
  })

  it('should be able to set prg rom & prg data', () => {
    const mapper = new MapperMMC1(2, 2)
    mapper.controlReg |= 0b0001_0000
    mapper.controlReg |= 0b0000_1100
    mapper.controlReg ^= 0b0000_1100
    mapper.controlReg |= 0b0000_0000

    let x = 0x15
    shift(mapper, x, 0xe001)
    expect(mapper.prgRom32kBankNumber).toBe((x & 0b0000_1110) >> 1)

    x = 0x15
    mapper.controlReg |= 0b0000_0100
    shift(mapper, x, 0xe001)
    expect(mapper.prgRom32kBankNumber).toBe((x & 0b0000_1110) >> 1)

    x = 0x15
    mapper.controlReg ^= 0b0000_0100
    mapper.controlReg |= 0b0000_1000
    shift(mapper, x, 0xe001)
    expect(mapper.prgRom16kLowBankNumber).toBe(0)
    expect(mapper.prgRom16kHighBankNumber).toBe(x & 0b0000_1111)

    x = 0x15
    mapper.controlReg ^= 0b0000_1000
    mapper.controlReg |= 0b0000_1100
    shift(mapper, x, 0xe001)
    expect(mapper.prgRom16kLowBankNumber).toBe(x & 0b0000_1111)
    expect(mapper.prgRom16kHighBankNumber).toBe(mapper.prgBankNumber - 1)
  })
})
