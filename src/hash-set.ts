export class HashSet<T> implements Iterable<T> {
  #map = new Map<string, T>()

  constructor(private hash: (value: T) => string) {}

  add(value: T) {
    this.#map.set(this.hash(value), value)
    return this
  }

  delete(value: T) {
    return this.#map.delete(this.hash(value))
  }

  has(value: T) {
    return this.#map.has(this.hash(value))
  }

  clear() {
    this.#map.clear()
  }

  values() {
    return this.#map.values()
  }

  get size() {
    return this.#map.size
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  [Symbol.iterator]() {
    return this.#map.values()
  }
}
