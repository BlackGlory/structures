export class SparseMap<T> {
  private keyToIndex: Array<number | undefined> = []
  private indexToKey: number[] = []
  private indexToValue: T[] = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.indexToKey.length
  }

  get internalArray(): T[] {
    return this.indexToValue
  }

  * entries(): IterableIterator<[key: number, value: T]> {
    for (let i = 0; i < this.indexToKey.length; i++) {
      yield [this.indexToKey[i], this.indexToValue[i]]
    }
  }

  keys(): IterableIterator<number> {
    return this.indexToKey.values()
  }

  values(): IterableIterator<T> {
    return this.indexToValue.values()
  }

  getInternalIndexOfKey(key: number): number | undefined {
    return this.keyToIndex[key]
  }

  has(key: number): boolean {
    return this.keyToIndex[key] !== undefined
  }

  get(key: number): T | undefined {
    if (this.has(key)) {
      const index = this.keyToIndex[key]!
      return this.indexToValue[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: T): void {
    if (this.has(key)) {
      const index = this.keyToIndex[key]!
      this.indexToValue[index] = value
    } else {
      const index = this.indexToKey.length
      this.indexToKey.push(key)
      this.indexToValue.push(value)
      this.keyToIndex[key] = index
    }
  }

  delete(key: number): void {
    if (this.has(key)) {
      const lastKey = this.indexToKey.pop()!
      const lastValue = this.indexToValue.pop()!
      if (key === lastKey) {
        this.keyToIndex[key] = undefined
      } else {
        const index = this.keyToIndex[key]!
        this.indexToKey[index] = lastKey
        this.indexToValue[index] = lastValue
        this.keyToIndex[lastKey] = index
        this.keyToIndex[key] = undefined
      }
    }
  }

  clear(): void {
    this.keyToIndex.length = 0
    this.indexToKey.length = 0
    this.indexToValue.length = 0
  }
}
