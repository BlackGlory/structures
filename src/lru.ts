import { assert, CustomError } from '@blackglory/errors'

export class LRU<K, V> {
  #limit: number
  #map = new Map<K, V>()

  constructor(limit: number) {
    assert(Number.isInteger(limit), 'The parameter limit must be an integer')
    assert(limit > 0, 'The parameter limit must be a positive value')

    this.#limit = limit
  }

  set(key: K, val: V): void {
    if (this.#map.has(key)) {
      this.updateItem(key, val)
    } else {
      if (this.#map.size === this.#limit) {
        this.#map.delete(this.getOldestKey())
      }
      this.#map.set(key, val)
    }
  }

  has(key: K): boolean {
    return this.#map.has(key)
  }

  /**
   * @throws NotFound
   */
  get(key: K): V {
    if (!this.#map.has(key)) throw new Error('')

    const val = this.#map.get(key)!
    this.updateItem(key, val)
    return val
  }

  tryGet(key: K): V | undefined {
    try {
      return this.get(key)
    } catch (e) {
      if (e instanceof NotFound) return undefined
      throw e
    }
  }

  /**
   * Reinsert the item.
   */
  private updateItem(key: K, val: V): void {
    this.#map.delete(key)
    this.#map.set(key, val)
  }

  /**
   * Return the earliest key inserted in the Map
   */
  private getOldestKey(): K {
    return this.#map.keys().next().value as K
  }
}

export class NotFound extends CustomError {}
