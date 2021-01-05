import { getError } from 'return-style'
import { Queue, EmptyQueueError } from '@src/queue'

describe('Queue<T>', () => {
  describe('empty(): void', () => {
    const queue = new Queue<number>()
    queue.enqueue(1)

    queue.empty()

    expect(queue.size).toBe(0)
  })

  describe('enqueue(...items: T[]): void', () => {
    const queue = new Queue<number>()

    const result = queue.enqueue(1, 2)

    expect(result).toBeUndefined()
    expect(queue.size).toBe(2)
  })

  describe('dequeue(): T', () => {
    describe('queue is empty', () => {
      it('throw EmptyQueueError', () => {
        const queue = new Queue<number>()

        const err = getError(() => queue.dequeue())

        expect(err).toBeInstanceOf(EmptyQueueError)
      })
    })

    describe('queue isnt empty', () => {
      it('return T', () => {
        const firstIn = 1
        const secondIn = 2
        const queue = new Queue<number>()

        queue.enqueue(firstIn, secondIn)
        const result = queue.dequeue()

        expect(result).toBe(firstIn)
        expect(queue.size).toBe(1)
      })
    })
  })
})
