import { describe, test, expect, it } from 'vitest'
import { UniqueQueue } from '@src/unique-queue.js'

describe('UniqueQueue', () => {
  test('[Symbol.toStringTag]', () => {
    const queue = new UniqueQueue()

    const result = Object.prototype.toString.call(queue)

    expect(result).toBe('[object UniqueQueue]')
  })

  test('size', () => {
    const queue = new UniqueQueue<number>()

    const result1 = queue.size
    queue.enqueue(1, 2, 3)
    const result2 = queue.size
    queue.dequeue()
    const result3 = queue.size
    queue.empty()
    const result4 = queue.size

    expect(result1).toBe(0)
    expect(result2).toBe(3)
    expect(result3).toBe(2)
    expect(result4).toBe(0)
  })

  test('empty(): void', () => {
    const queue = new UniqueQueue<number>()
    queue.enqueue(1)

    queue.empty()

    expect(queue.size).toBe(0)
  })

  describe('enqueue(...items: T[]): void', () => {
    test('enqueue new items', () => {
      const queue = new UniqueQueue<number>()

      queue.enqueue(1, 2)

      expect(queue.size).toBe(2)
    })

    test('enqueue exist items', () => {
      const queue = new UniqueQueue<number>()

      queue.enqueue(1, 2, 1)

      expect(queue.size).toBe(2)
      expect(queue.dequeue()).toBe(1)
      expect(queue.dequeue()).toBe(2)
    })
  })

  describe('dequeue(): T | undefined', () => {
    describe('queue is empty', () => {
      it('return undefined', () => {
        const queue = new UniqueQueue<number>()

        const result = queue.dequeue()

        expect(result).toBeUndefined()
      })
    })

    describe('queue isnt empty', () => {
      it('return values order by FIFO', () => {
        const queue = new UniqueQueue<number>()

        queue.enqueue(1, 2)
        const result1 = queue.dequeue()
        const size1 = queue.size
        const result2 = queue.dequeue()
        const size2 = queue.size

        expect(result1).toBe(1)
        expect(size1).toBe(1)
        expect(result2).toBe(2)
        expect(size2).toBe(0)
      })
    })
  })

  describe('remove(item: T): void', () => {
    it('remove the specific item', () => {
      const queue = new UniqueQueue<number>()
      queue.enqueue(1)
      queue.enqueue(2)

      queue.remove(1)

      expect(queue.size).toBe(1)
      expect(queue.dequeue()).toBe(2)
    })
  })
})
