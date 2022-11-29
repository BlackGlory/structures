/**
 * A `Map` that supports unlimited elements.
 * 
 * Note that `BigMap` cannot preserve the insertion order of elements.
 */
export class BigMap<K, V> implements Iterable<[K, V]> {
  _maps: Array<Map<K, V>> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this._maps
      .map(map => map.size)
      .reduce((acc, cur) => acc + cur, 0)
  }

  * [Symbol.iterator](): IterableIterator<[K, V]> {
    for (const map of this._maps) {
      yield* map[Symbol.iterator]()
    }
  }

  set(key: K, value: V): void {
    {
      const map = this._maps.find(map => map.has(key))
      if (map) {
        map.set(key, value)
        return
      }
    }

    for (const map of this._maps) {
      try {
        map.set(key, value)
        return
      } catch (e) {
        if (e instanceof RangeError) continue
        throw e
      }
    }

    const map = new Map<K, V>()
    map.set(key, value)
    this._maps.push(map)
  }

  has(key: K): boolean {
    return this._maps.some(set => set.has(key))
  }

  get(key: K): V | undefined {
    for (const map of this._maps) {
      if (map.has(key)) {
        return map.get(key)!
      }
    }
  }

  delete(key: K): boolean {
    for (const [index, map] of this._maps.entries()) {
      if (map.has(key)) {
        map.delete(key)

        if (map.size === 0) {
          this._maps.splice(index, 1)
        }

        return true
      }
    }

    return false
  }

  clear(): void {
    this._maps = []
  }

  * entries(): IterableIterator<[K, V]> {
    for (const map of this._maps) {
      yield* map.entries()
    }
  }

  * keys(): IterableIterator<K> {
    for (const map of this._maps) {
      yield* map.keys()
    }
  }

  * values(): IterableIterator<V> {
    for (const map of this._maps) {
      yield* map.values()
    }
  }
}
