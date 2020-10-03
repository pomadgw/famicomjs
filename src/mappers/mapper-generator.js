export default function mapperGenerator({
  cpuMapReadFn,
  cpuMapWriteFn,
  ppuMapReadFn,
  ppuMapWriteFn,
  constructor = () => {},
  ...otherMethods
}) {
  const Class = class Mapper {
    constructor(prgBankNumber, chrBankNumber) {
      this.prgBankNumber = prgBankNumber
      this.chrBankNumber = chrBankNumber

      constructor.bind(this)()
    }

    cpuMapRead(addr) {
      const { status, mappedAddress } = cpuMapReadFn.apply(this, [addr])

      return {
        status,
        mappedAddress
      }
    }

    cpuMapWrite(addr) {
      const { status, mappedAddress } = cpuMapWriteFn.apply(this, [addr])

      return {
        status,
        mappedAddress
      }
    }

    ppuMapRead(addr) {
      const { status, mappedAddress } = ppuMapReadFn.apply(this, [addr])

      return {
        status,
        mappedAddress
      }
    }

    ppuMapWrite(addr) {
      const { status, mappedAddress } = ppuMapWriteFn.apply(this, [addr])

      return {
        status,
        mappedAddress
      }
    }
  }

  Object.entries(otherMethods).forEach(([key, fn]) => {
    Class.prototype[key] = fn
  })

  return Class
}
