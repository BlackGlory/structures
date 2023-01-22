import { Emitter } from '@src/emitter.js'
import { jest } from '@jest/globals'

describe('Emitter', () => {
  test('[Symbol.toStringTag]', () => {
    const emitter = new Emitter()

    const result = Object.prototype.toString.call(emitter)

    expect(result).toBe('[object Emitter]')
  })

  describe('on', () => {
    test('add the listener', () => {
      const event = 'event'
      const emitter = new Emitter()
      const listener = jest.fn()

      emitter.on(event, listener)
      emitter.emit(event, 'data-1')
      emitter.emit(event, 'data-2')

      expect(listener).toBeCalledTimes(2)
      expect(listener).nthCalledWith(1, 'data-1')
      expect(listener).nthCalledWith(2, 'data-2')
    })

    test('remove the listener', () => {
      const emitter = new Emitter()
      const event = 'event'
      const listener = jest.fn()

      const removeListener = emitter.on(event, listener)
      removeListener()
      emitter.emit(event, 'data')

      expect(listener).not.toBeCalled()
    })

    describe('same listeners', () => {
      test('add listeners', () => {
        const emitter = new Emitter()
        const event = 'event'
        const listener = jest.fn()

        emitter.on(event, listener)
        emitter.on(event, listener)
        emitter.emit(event, 'data')

        expect(listener).toBeCalledTimes(2)
        expect(listener).toBeCalledWith('data')
      })

      test('remove listeners', () => {
        const emitter = new Emitter()
        const event = 'event'
        const listener = jest.fn()

        const removeListener1 = emitter.on(event, listener)
        emitter.on(event, listener)
        removeListener1()
        emitter.emit(event, 'data')

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith('data')
      })
    })
  })

  describe('once', () => {
    test('add the listener', () => {
      const emitter = new Emitter()
      const event = 'event'
      const listener = jest.fn()

      emitter.once(event, listener)
      emitter.emit(event, 'data')
      emitter.emit(event, 'data')

      expect(listener).toBeCalledTimes(1)
      expect(listener).toBeCalledWith('data')
    })

    test('remove the listener', () => {
      const emitter = new Emitter()
      const event = 'event'
      const listener = jest.fn()

      const removeListener = emitter.once(event, listener)
      removeListener()
      emitter.emit(event, 'data')

      expect(listener).not.toBeCalled()
    })

    describe('same listeners', () => {
      test('add listeners', () => {
        const emitter = new Emitter()
        const event = 'event'
        const listener = jest.fn()

        emitter.once(event, listener)
        emitter.once(event, listener)
        emitter.emit(event, 'data')

        expect(listener).toBeCalledTimes(2)
        expect(listener).toBeCalledWith('data')
      })

      test('remove listeners', () => {
        const emitter = new Emitter()
        const event = 'event'
        const listener = jest.fn()

        const removeListener1 = emitter.once(event, listener)
        emitter.once(event, listener)
        removeListener1()
        emitter.emit(event, 'data')

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith('data')
      })
    })
  })

  test('emit', () => {
    const emitter = new Emitter()
    const event1 = 'event-1'
    const event2 = 'event-2'
    const listener1 = jest.fn()
    const listener2 = jest.fn()
    const listener3 = jest.fn()

    emitter.on(event1, listener1)
    emitter.on(event1, listener2)
    emitter.on(event2, listener3)
    emitter.emit(event1, 'data-1')
    emitter.emit(event2, 'data-2')

    expect(listener1).toBeCalledTimes(1)
    expect(listener1).toBeCalledWith('data-1')
    expect(listener2).toBeCalledTimes(1)
    expect(listener2).toBeCalledWith('data-1')
    expect(listener3).toBeCalledTimes(1)
    expect(listener3).toBeCalledWith('data-2')
  })
})
