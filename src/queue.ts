import { CustomError } from '@blackglory/errors'

export class Queue<T> {
  #items: T[] = []

  empty(): void {
    this.#items.length = 0
  }

  enqueue(...items: T[]): void {
    this.#items.push(...items)
  }

  /**
   * @throws {EmptyQueueError}
   */
  dequeue(): T {
    if (this.size === 0) throw new EmptyQueueError()
    return this.#items.shift()!
  }

  get size(): number {
    return this.#items.length
  }

  remove(item: T): void {
    let index: number
    while ((index = this.#items.indexOf(item)) >= 0) {
      this.#items.splice(index, 1)
    }
  }
}

export class EmptyQueueError extends CustomError {
  constructor() {
    super('Queue is empty.')
  }
}
