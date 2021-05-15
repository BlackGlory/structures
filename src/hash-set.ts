export class HashSet<V, K = unknown> implements Iterable<V> {
  #map = new Map<K, V>()

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  get size() {
    return this.#map.size
  }

  [Symbol.iterator]() {
    return this.#map.values()
  }

  constructor(private hash: (value: V) => K) {}

  add(value: V): this {
    this.#map.set(this.hash(value), value)
    return this
  }

  delete(value: V): boolean {
    return this.#map.delete(this.hash(value))
  }

  has(value: V): boolean {
    return this.#map.has(this.hash(value))
  }

  clear(): void {
    this.#map.clear()
  }

  values(): Iterable<V> {
    return this.#map.values()
  }
}
