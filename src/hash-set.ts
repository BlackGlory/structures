export class HashSet<V, Hash = unknown> implements Iterable<V> /* ReadonlySetLike<V> */ {
  private map = new Map<Hash, V>()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.map.size
  }

  [Symbol.iterator](): IterableIterator<V> {
    return this.map.values()
  }

  constructor(private hash: (value: V) => Hash) {}

  add(value: V): this {
    this.map.set(this.hash(value), value)
    return this
  }

  delete(value: V): boolean {
    return this.map.delete(this.hash(value))
  }

  has(value: V): boolean {
    return this.map.has(this.hash(value))
  }

  get(value: V): V | undefined {
    return this.map.get(this.hash(value))
  }

  clear(): void {
    this.map.clear()
  }

  keys(): IterableIterator<V> {
    return this.values()
  }

  values(): IterableIterator<V> {
    return this.map.values()
  }
}
