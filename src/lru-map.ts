import { assert } from '@blackglory/errors'
import { first } from 'iterable-operator'

export class LRUMap<K, V> {
  private limit: number
  private map = new Map<K, V>()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.map.size
  }

  constructor(limit: number) {
    assert(Number.isInteger(limit), 'The parameter limit must be an integer')
    assert(limit > 0, 'The parameter limit must be a positive value')

    this.limit = limit
  }

  set(key: K, value: V): this {
    if (this.map.has(key)) {
      this.updateItem(key, value)
    } else {
      if (this.map.size === this.limit) {
        this.map.delete(this.getColdestKey()!)
      }
      this.map.set(key, value)
    }
    return this
  }

  has(key: K): boolean {
    return this.map.has(key)
  }

  get(key: K): V | undefined {
    if (!this.has(key)) return undefined

    const value = this.map.get(key)!
    this.updateItem(key, value)
    return value
  }

  delete(key: K): boolean {
    return this.map.delete(key)
  }

  clear(): void {
    this.map.clear()
  }

  /**
   * Reinsert the item.
   */
  private updateItem(key: K, value: V): void {
    this.map.delete(key)
    this.map.set(key, value)
  }

  /**
   * Return the earliest key inserted in the Map
   */
  private getColdestKey(): K | undefined {
    return first(this.map.keys())
  }
}
