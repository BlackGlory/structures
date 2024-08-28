import { describe, test, expect, vi } from 'vitest'
import { GeneratorEmitter } from '@src/generator-emitter.js'
import { toArray } from 'iterable-operator'

describe('GeneratorEmitter', () => {
  test('[Symbol.toStringTag]', () => {
    const emitter = new GeneratorEmitter()

    const result = Object.prototype.toString.call(emitter)

    expect(result).toBe('[object GeneratorEmitter]')
  })

  describe('on', () => {
    test('add the listener', () => {
      const emitter = new GeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      emitter.on(event, listener)
      toArray(emitter.emit(event, 'data-1'))
      toArray(emitter.emit(event, 'data-2'))

      expect(listener).toBeCalledTimes(2)
      expect(listener).nthCalledWith(1, 'data-1')
      expect(listener).nthCalledWith(2, 'data-2')
    })

    test('remove the listener', () => {
      const emitter = new GeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      const removeListener = emitter.on(event, listener)
      removeListener()
      toArray(emitter.emit(event, 'data'))

      expect(listener).not.toBeCalled()
    })

    describe('same listeners', () => {
      test('add listeners', () => {
        const emitter = new GeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        emitter.on(event, listener)
        emitter.on(event, listener)
        toArray(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(2)
        expect(listener).toBeCalledWith('data')
      })

      test('remove listeners', () => {
        const emitter = new GeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        const removeListener1 = emitter.on(event, listener)
        emitter.on(event, listener)
        removeListener1()
        toArray(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith('data')
      })
    })
  })

  describe('once', () => {
    test('add the listener', () => {
      const emitter = new GeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      emitter.once(event, listener)
      toArray(emitter.emit(event, 'data'))
      toArray(emitter.emit(event, 'data'))

      expect(listener).toBeCalledTimes(1)
      expect(listener).toBeCalledWith('data')
    })

    test('remove the listener', () => {
      const emitter = new GeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      const removeListener = emitter.once(event, listener)
      removeListener()
      toArray(emitter.emit(event, 'data'))

      expect(listener).not.toBeCalled()
    })

    describe('same listeners', () => {
      test('add listeners', () => {
        const emitter = new GeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        emitter.once(event, listener)
        emitter.once(event, listener)
        toArray(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(2)
        expect(listener).toBeCalledWith('data')
      })

      test('remove listeners', () => {
        const emitter = new GeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        const removeListener1 = emitter.once(event, listener)
        emitter.once(event, listener)
        removeListener1()
        toArray(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith('data')
      })
    })
  })

  test('emit', () => {
    const emitter = new GeneratorEmitter<{
      'event-1': [value: string]
      'event-2': [value: string]
    }>()
    const event1 = 'event-1'
    const event2 = 'event-2'
    function* listener1(value: string): Generator<{
      listener: string
      value: string
    }> {
      yield {
        listener: 'listener-1'
      , value
      }
    }
    function* listener2(value: string): Generator<{
      listener: string
      value: string
    }> {
      yield {
        listener: 'listener-2'
      , value
      }
    }
    function* listener3(value: string): Generator<{
      listener: string
      value: string
    }> {
      yield {
        listener: 'listener-3'
      , value
      }
    }

    emitter.on(event1, listener1)
    emitter.on(event1, listener2)
    emitter.on(event2, listener3)
    const result1 = toArray(emitter.emit(event1, 'data-1'))
    const result2 = toArray(emitter.emit(event2, 'data-2'))

    expect(result1).toStrictEqual([
      {
        listener: 'listener-1'
      , value: 'data-1'
      }
    , {
        listener: 'listener-2'
      , value: 'data-1'
      }
    ])
    expect(result2).toStrictEqual([
      {
        listener: 'listener-3'
      , value: 'data-2'
      }
    ])
  })

  test('removeAllListeners', () => {
    const emitter = new GeneratorEmitter()
    const event = 'event'
    const listener = vi.fn<() => void>()

    emitter.on(event, listener)
    emitter.removeAllListeners(event)
    toArray(emitter.emit(event, 'data'))

    expect(listener).not.toBeCalled()
  })
})
