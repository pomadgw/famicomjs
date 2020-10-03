import generator from './mapper-generator'

describe('Mapper generator', () => {
  it('should create a mapper class', () => {
    const Class = generator({
      cpuMapReadFn(address) {
        return {
          status: false,
          mappedAddress: 0
        }
      },
      cpuMapWriteFn(address) {
        return {
          status: false,
          mappedAddress: 0
        }
      },
      ppuMapReadFn(address) {
        return {
          status: false,
          mappedAddress: 0
        }
      },
      ppuMapWriteFn(address) {
        return {
          status: false,
          mappedAddress: 0
        }
      }
    })

    const mapper = new Class(10, 10)
    expect(mapper.chrBankNumber).toBe(10)
    expect(mapper.prgBankNumber).toBe(10)
  })

  it('should add additional method into mapper class', () => {
    const callMe = jest.fn()

    const Class = generator({
      cpuMapReadFn(address) {
        return {
          status: false,
          mappedAddress: 0
        }
      },
      cpuMapWriteFn(address) {
        this.callMe()
        return {
          status: false,
          mappedAddress: 0
        }
      },
      ppuMapReadFn(address) {
        return {
          status: false,
          mappedAddress: 0
        }
      },
      ppuMapWriteFn(address) {
        return {
          status: false,
          mappedAddress: 0
        }
      },
      callMe
    })

    const mapper = new Class(10, 10)
    mapper.cpuMapWrite(1, 1)
    expect(callMe).toHaveBeenCalled()
  })
})
