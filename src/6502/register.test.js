import RegisterStatus from './register'
import { Flags } from './flags'

describe('6502 CPU (wasm): RegisterStatus', () => {
  describe('#valueOf', () => {
    it('should return correct value', () => {
      const status = new RegisterStatus(0b00000001)

      expect(+status).toBe(0b00000001)
    })
  })

  it('should fetch correct value', () => {
    const status = new RegisterStatus(0b00000001)

    expect(status.getStatus(Flags.C)).toBe(true)

    status.status = 0b0000010
    expect(status.getStatus(Flags.C)).toBe(false)
    expect(status.getStatus(Flags.Z)).toBe(true)
  })

  it('should set value into correct status', () => {
    const status = new RegisterStatus(0b01000000)

    status.setStatus(Flags.C, true)
    expect(status.status).toBe(0b01000001)

    status.setStatus(Flags.C, false)
    expect(status.status).toBe(0b01000000)

    status.setStatus(Flags.N, true)
    expect(status.status).toBe(0b11000000)

    status.setStatus(Flags.N, false)
    expect(status.status).toBe(0b01000000)
  })
})
