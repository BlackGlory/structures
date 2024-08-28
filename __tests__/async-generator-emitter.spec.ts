import { describe, test, expect, vi } from 'vitest'
import { AsyncGeneratorEmitter } from '@src/async-generator-emitter.js'
import { toArrayAsync } from 'iterable-operator'

describe('AsyncGeneratorEmitter', () => {
  test('[Symbol.toStringTag]', () => {
    const emitter = new AsyncGeneratorEmitter()

    const result = Object.prototype.toString.call(emitter)

    expect(result).toBe('[object AsyncGeneratorEmitter]')
  })

  describe('on', () => {
    test('add the listener', async () => {
      const emitter = new AsyncGeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      emitter.on(event, listener)
      await toArrayAsync(emitter.emit(event, 'data-1'))
      await toArrayAsync(emitter.emit(event, 'data-2'))

      expect(listener).toBeCalledTimes(2)
      expect(listener).nthCalledWith(1, 'data-1')
      expect(listener).nthCalledWith(2, 'data-2')
    })

    test('remove the listener', async () => {
      const emitter = new AsyncGeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      const removeListener = emitter.on(event, listener)
      removeListener()
      await toArrayAsync(emitter.emit(event, 'data'))

      expect(listener).not.toBeCalled()
    })

    describe('same listeners', () => {
      test('add listeners', async () => {
        const emitter = new AsyncGeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        emitter.on(event, listener)
        emitter.on(event, listener)
        await toArrayAsync(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(2)
        expect(listener).toBeCalledWith('data')
      })

      test('remove listeners', async () => {
        const emitter = new AsyncGeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        const removeListener1 = emitter.on(event, listener)
        emitter.on(event, listener)
        removeListener1()
        await toArrayAsync(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith('data')
      })
    })
  })

  describe('once', () => {
    test('add the listener', async () => {
      const emitter = new AsyncGeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      emitter.once(event, listener)
      await toArrayAsync(emitter.emit(event, 'data'))
      await toArrayAsync(emitter.emit(event, 'data'))

      expect(listener).toBeCalledTimes(1)
      expect(listener).toBeCalledWith('data')
    })

    test('remove the listener', async () => {
      const emitter = new AsyncGeneratorEmitter()
      const event = 'event'
      const listener = vi.fn<() => void>()

      const removeListener = emitter.once(event, listener)
      removeListener()
      await toArrayAsync(emitter.emit(event, 'data'))

      expect(listener).not.toBeCalled()
    })

    describe('same listeners', () => {
      test('add listeners', async () => {
        const emitter = new AsyncGeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        emitter.once(event, listener)
        emitter.once(event, listener)
        await toArrayAsync(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(2)
        expect(listener).toBeCalledWith('data')
      })

      test('remove listeners', async () => {
        const emitter = new AsyncGeneratorEmitter()
        const event = 'event'
        const listener = vi.fn<() => void>()

        const removeListener1 = emitter.once(event, listener)
        emitter.once(event, listener)
        removeListener1()
        await toArrayAsync(emitter.emit(event, 'data'))

        expect(listener).toBeCalledTimes(1)
        expect(listener).toBeCalledWith('data')
      })
    })
  })

  test('emit', async () => {
    const emitter = new AsyncGeneratorEmitter<{
      'event-1': [value: string]
      'event-2': [value: string]
    }>()
    const event1 = 'event-1'
    const event2 = 'event-2'
    async function* listener1(value: string): AsyncGenerator<{
      listener: string
      value: string
    }> {
      yield {
        listener: 'listener-1'
      , value
      }
    }
    async function* listener2(value: string): AsyncGenerator<{
      listener: string
      value: string
    }> {
      yield {
        listener: 'listener-2'
      , value
      }
    }
    async function* listener3(value: string): AsyncGenerator<{
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
    const result1 = await toArrayAsync(emitter.emit(event1, 'data-1'))
    const result2 = await toArrayAsync(emitter.emit(event2, 'data-2'))

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

  test('removeAllListeners', async () => {
    const emitter = new AsyncGeneratorEmitter()
    const event = 'event'
    const listener = vi.fn<() => void>()

    emitter.on(event, listener)
    emitter.removeAllListeners(event)
    await toArrayAsync(emitter.emit(event, 'data'))

    expect(listener).not.toBeCalled()
  })
})
