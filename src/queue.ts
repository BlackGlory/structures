export class Queue<T> {
  private items: T[] = []

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  get size(): number {
    return this.items.length
  }

  empty(): void {
    this.items.length = 0
  }

  enqueue(...items: T[]): void {
    this.items.push(...items)
  }

  dequeue(): T | undefined {
    return this.items.shift()
  }

  remove(item: T): void {
    let index: number
    while ((index = this.items.indexOf(item)) >= 0) {
      this.items.splice(index, 1)
    }
  }
}
