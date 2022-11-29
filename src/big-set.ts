/**
 * A `Set` that supports unlimited elements.
 * 
 * Note that `BigSet` cannot preserve the insertion order of elements.
 */
export class BigSet<T> implements Iterable<T> {
  _sets: Array<Set<T>> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this._sets
      .map(set => set.size)
      .reduce((acc, cur) => acc + cur, 0)
  }

  * [Symbol.iterator](): IterableIterator<T> {
    for (const set of this._sets) {
      yield* set[Symbol.iterator]()
    }
  }

  add(value: T): void {
    if (this._sets.some(set => set.has(value))) return

    for (const set of this._sets) {
      try {
        set.add(value)
        return
      } catch (e) {
        if (e instanceof RangeError) continue
        throw e
      }
    }

    const set = new Set<T>()
    set.add(value)
    this._sets.push(set)
  }

  has(value: T): boolean {
    return this._sets.some(set => set.has(value))
  }

  delete(value: T): boolean {
    for (const [index, set] of this._sets.entries()) {
      if (set.has(value)) {
        set.delete(value)

        if (set.size === 0) {
          this._sets.splice(index, 1)
        }

        return true
      }
    }

    return false
  }

  clear(): void {
    this._sets = []
  }

  * values(): IterableIterator<T> {
    for (const set of this._sets) {
      yield* set.values()
    }
  }
}
