import { Emitter } from '@src/emitter'

describe('Emitter', () => {
  describe('on(event: string, handler: Handler<T>)', () => {
    test('The same handler will only be registered once', () => {
      const emitter = new Emitter()
      const event = 'event'
      const handler = jest.fn()

      emitter.on(event, handler)
      emitter.on(event, handler)
      emitter.emit(event, 'hello')

      expect(handler).toBeCalledTimes(1)
      expect(handler).toBeCalledWith('hello')
    })
  })

  test('off(event: string, handler: Handler<T>)', () => {
    const emitter = new Emitter()
    const event = 'event'
    const handler = jest.fn()

    emitter.on(event, handler)
    emitter.off(event, handler)
    emitter.emit(event, 'hello')

    expect(handler).toBeCalledTimes(0)
  })

  test('emit(event: string, value: T): void', () => {
    const emitter = new Emitter()
    const event = 'event'
    const handler1 = jest.fn()
    const handler2 = jest.fn()

    emitter.on(event, handler1)
    emitter.on(event, handler2)
    emitter.emit(event, 'hello')

    expect(handler1).toBeCalledTimes(1)
    expect(handler1).toBeCalledWith('hello')
    expect(handler2).toBeCalledTimes(1)
    expect(handler2).toBeCalledWith('hello')
  })
})
