import { getError } from 'return-style'
import { Queue, EmptyQueueError } from '@src/queue'

describe('Queue<T>', () => {
  describe('empty(): void', () => {
    it('returns undefined', () => {
      const queue = new Queue<number>()
      queue.enqueue(1)

      const result = queue.empty()

      expect(result).toBeUndefined()
      expect(queue.size).toBe(0)
    })
  })

  describe('enqueue(...items: T[]): void', () => {
    it('returns undefined', () => {
      const queue = new Queue<number>()

      const result = queue.enqueue(1, 2)

      expect(result).toBeUndefined()
      expect(queue.size).toBe(2)
    })
  })

  describe('dequeue(): T', () => {
    describe('queue is empty', () => {
      it('throws EmptyQueueError', () => {
        const queue = new Queue<number>()

        const err = getError(() => queue.dequeue())

        expect(err).toBeInstanceOf(EmptyQueueError)
      })
    })

    describe('queue isnt empty', () => {
      it('returns T', () => {
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

  describe('remove(item: T): void', () => {
    it('remove all specific items', () => {
      const queue = new Queue<number>()
      queue.enqueue(1)
      queue.enqueue(2)
      queue.enqueue(1)

      const result = queue.remove(1)

      expect(result).toBeUndefined()
      expect(queue.size).toBe(1)
      expect(queue.dequeue()).toBe(2)
    })
  })
})
