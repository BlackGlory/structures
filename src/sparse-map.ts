export class SparseMap<T> {
  private keyToIndex: Array<number | undefined> = []
  private indexToKey: number[] = []
  private indexToValue: T[] = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
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

  has(key: number): boolean {
    // 跟一般的稀疏集实现不同, 不需要访问values数组.
    return key in this.keyToIndex
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
        delete this.keyToIndex[key]
      } else {
        const index = this.keyToIndex[key]!
        this.indexToKey[index] = lastKey
        this.indexToValue[index] = lastValue
        this.keyToIndex[key] = index
        delete this.keyToIndex[key]
      }
    }
  }
}
