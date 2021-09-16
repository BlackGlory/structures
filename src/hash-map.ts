export class HashMap<K, V, H = unknown> {
  #map = new Map<H, V>()

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  get size() {
    return this.#map.size
  }

  constructor(private hash: (key: K) => H) {}

  set(key: K, value: V): this {
    this.#map.set(this.hash(key), value)
    return this
  }

  has(key: K): boolean {
    return this.#map.has(this.hash(key))
  }

  get(key: K): V | undefined {
    return this.#map.get(this.hash(key))
  }

  delete(key: K): boolean {
    return this.#map.delete(this.hash(key))
  }

  clear(): void {
    this.#map.clear()
  }
}