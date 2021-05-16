import { assert, CustomError } from '@blackglory/errors'

export class LRUMap<K, V> {
  #limit: number
  #map = new Map<K, V>()

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  get size() {
    return this.#map.size
  }

  constructor(limit: number) {
    assert(Number.isInteger(limit), 'The parameter limit must be an integer')
    assert(limit > 0, 'The parameter limit must be a positive value')

    this.#limit = limit
  }

  set(key: K, value: V): this {
    if (this.#map.has(key)) {
      this.updateItem(key, value)
    } else {
      if (this.#map.size === this.#limit) {
        this.#map.delete(this.getColdestKey())
      }
      this.#map.set(key, value)
    }
    return this
  }

  has(key: K): boolean {
    return this.#map.has(key)
  }

  /**
   * @throws NotFound
   */
  get(key: K): V {
    if (!this.#map.has(key)) throw new NotFoundError()

    const val = this.#map.get(key)!
    this.updateItem(key, val)
    return val
  }

  tryGet(key: K): V | undefined {
    try {
      return this.get(key)
    } catch (e) {
      if (e instanceof NotFoundError) return undefined
      throw e
    }
  }

  delete(key: K): boolean {
    return this.#map.delete(key)
  }

  clear(): void {
    this.#map.clear()
  }

  /**
   * Reinsert the item.
   */
  private updateItem(key: K, value: V): void {
    this.#map.delete(key)
    this.#map.set(key, value)
  }

  /**
   * Return the earliest key inserted in the Map
   */
  private getColdestKey(): K {
    return this.#map.keys().next().value as K
  }
}

export class NotFoundError extends CustomError {}
