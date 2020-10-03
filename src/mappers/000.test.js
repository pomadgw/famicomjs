import Mapper000 from './000'

describe('Mapper000', () => {
  it('should return correct mapped address and status if given address is within range for CPU and got 32K ROM', () => {
    const mapper = new Mapper000(2, 1)

    expect(mapper.cpuMapRead(0x6000).status).toBe(false)
    expect(mapper.cpuMapRead(0x8001)).toEqual({
      status: true,
      mappedAddress: 0x8001 & 0x7fff
    })

    expect(mapper.cpuMapWrite(0x6000).status).toBe(false)
    expect(mapper.cpuMapWrite(0x8001)).toEqual({
      status: true,
      mappedAddress: 0x8001 & 0x7fff
    })
  })

  it('should return correct mapped address if given address is within range for CPU and got 16K ROM', () => {
    const mapper = new Mapper000(1, 1)

    expect(mapper.cpuMapRead(0x6000).status).toBe(false)
    expect(mapper.cpuMapRead(0xd001)).toEqual({
      status: true,
      mappedAddress: 0xd001 & 0x3fff
    })

    expect(mapper.cpuMapWrite(0x6000).status).toBe(false)
    expect(mapper.cpuMapWrite(0xd001)).toEqual({
      status: true,
      mappedAddress: 0xd001 & 0x3fff
    })
  })

  it('should return correct mapped address for PPU', () => {
    const mapper = new Mapper000(1, 1)

    expect(mapper.ppuMapRead(0x2000).status).toBe(false)
    expect(mapper.ppuMapRead(0x0123)).toEqual({
      status: true,
      mappedAddress: 0x0123
    })
  })

  it('should return status false wehen attempting to write to CHR ROM', () => {
    const mapper = new Mapper000(1, 1)

    expect(mapper.ppuMapWrite(0x2000).status).toBe(false)
  })
})
