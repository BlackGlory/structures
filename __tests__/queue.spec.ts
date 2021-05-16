import { Queue } from '@src/queue'

describe('Queue', () => {
  test('[Symbol.toStringTag]', () => {
    const queue = new Queue()

    const result = Object.prototype.toString.call(queue)

    expect(result).toBe('[object Queue]')
  })

  test('size', () => {
    const queue = new Queue<number>()

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
    const queue = new Queue<number>()
    queue.enqueue(1)

    const result = queue.empty()

    expect(result).toBeUndefined()
    expect(queue.size).toBe(0)
  })

  test('enqueue(...items: T[]): void', () => {
    const queue = new Queue<number>()

    const result = queue.enqueue(1, 2)

    expect(result).toBeUndefined()
    expect(queue.size).toBe(2)
  })

  describe('dequeue(): T | undefined', () => {
    describe('queue is empty', () => {
      it('return undefined', () => {
        const queue = new Queue<number>()

        const result = queue.dequeue()

        expect(result).toBeUndefined()
      })
    })

    describe('queue isnt empty', () => {
      it('return values order by FIFO', () => {
        const queue = new Queue<number>()

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
