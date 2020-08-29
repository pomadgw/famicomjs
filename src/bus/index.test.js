import Bus from './index'

describe('Bus', () => {
  it('should be able to be connected to CPU', () => {
    const cpudummy = {
      connect: jest.fn()
    }

    const bus = new Bus(cpudummy)

    expect(bus.cpu).toBe(cpudummy)
    expect(cpudummy.connect).toHaveBeenCalledWith(bus)
  })
})
