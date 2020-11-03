import Controller from './index'

describe('controller', () => {
  it('should set certain button status', () => {
    const c = new Controller({
      KeyA: 'A'
    })

    c.setButtonState('A', true)
    expect(c.buttonStatus).toBe(0b00000001)
    c.setButtonState('Select', true)
    expect(c.buttonStatus).toBe(0b00000101)
    c.setButtonState('A', false)
    expect(c.buttonStatus).toBe(0b00000100)
  })

  it('should return only button A status when read with strobe bit on', () => {
    const c = new Controller({
      KeyA: 'A'
    })

    c.setButtonState('A', true)
    c.strobe = 1
    expect(c.read()).toBe(1)
    expect(c.read()).toBe(1)
  })

  it('should set buttonStatusToSend when strobe bit off', () => {
    const c = new Controller({
      KeyA: 'A'
    })

    c.strobe = 0
    c.setButtonState('A', true)
    expect(c.buttonStatusToSend).toBe(1)
  })

  it('should set buttonStatusToSend when strobe bit on', () => {
    const c = new Controller({
      KeyA: 'A'
    })

    c.strobe = 1
    c.setButtonState('A', true)
    expect(c.buttonStatusToSend).toBe(1)
  })

  it('should return all buttons status when read with strobe bit off', () => {
    const c = new Controller({
      KeyA: 'A'
    })

    c.buttonStatus = 0b10101010
    c.strobe = 0
    expect(c.read()).toBe(0)
    expect(c.read()).toBe(1)
    expect(c.read()).toBe(0)
    expect(c.read()).toBe(1)
    expect(c.read()).toBe(0)
    expect(c.read()).toBe(1)
    expect(c.read()).toBe(0)
    expect(c.read()).toBe(1)

    // end with all 1
    expect(c.read()).toBe(0)
  })

  it('shoulde set button given a keydown', () => {
    const c = new Controller({
      KeyA: 'A'
    })
    c.strobe = 1

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: 'KeyA'
      })
    )

    expect(c.buttonStatus).toBe(0b00000001)

    document.dispatchEvent(
      new KeyboardEvent('keyup', {
        code: 'KeyA'
      })
    )

    expect(c.buttonStatus).toBe(0b00000000)
  })
})
