import RegisterStatus from './register'

describe('RegisterStatus', () => {
  describe('#valueOf', () => {
    it('should return correct value', () => {
      const status = new RegisterStatus(0b00000001)

      expect(+status).toBe(0b00000001)
    })
  })

  it('should fetch correct value', () => {
    const status = new RegisterStatus(0b00000001)

    expect(status.getStatus('C')).toBe(true)

    status.status = 0b0000010
    expect(status.getStatus('C')).toBe(false)
    expect(status.getStatus('Z')).toBe(true)
  })

  it('should set value into correct status', () => {
    const status = new RegisterStatus(0b01000000)

    status.setStatus('C', true)
    expect(status.status).toBe(0b01000001)

    status.setStatus('C', false)
    expect(status.status).toBe(0b01000000)

    status.setStatus('N', true)
    expect(status.status).toBe(0b11000000)

    status.setStatus('N', false)
    expect(status.status).toBe(0b01000000)
  })

  it('should create a proxy', () => {
    const status = RegisterStatus.create(0b01000000)
    expect(status.V).toBe(true)

    status.C = true
    expect(status.status).toBe(0b01000001)
  })
})
