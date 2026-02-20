import { isntUndefined } from 'extra-utils'
import { first } from 'iterable-operator'

export class UniqueQueue<T> {
  private items: Set<T> = new Set()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.items.size
  }

  empty(): void {
    this.items.clear()
  }

  enqueue(...items: T[]): void {
    for (const item of items) {
      if (!this.items.has(item)) this.items.add(item)
    }
  }

  dequeue(): T | undefined {
    const value = first(this.items)
    if (isntUndefined(value)) this.items.delete(value)
    return value
  }

  remove(item: T): void {
    this.items.delete(item)
  }
}
