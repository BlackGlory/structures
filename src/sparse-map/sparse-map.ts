export class SparseMap<T> {
  private denseKeys: number[] = []
  private denseValues: T[] = []
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.denseKeys.length
  }

  readonly internalKeyArray: readonly number[] = this.denseKeys
  readonly internalValueArray: T[] = this.denseValues

  ;* entries(): IterableIterator<[key: number, value: T]> {
    for (let i = 0; i < this.denseKeys.length; i++) {
      yield [this.denseKeys[i], this.denseValues[i]]
    }
  }

  keys(): IterableIterator<number> {
    return this.denseKeys.values()
  }

  values(): IterableIterator<T> {
    return this.denseValues.values()
  }

  getInternalIndexOfKey(key: number): number | undefined {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      index < this.denseKeys.length && // 用于改善JIT优化.
      this.denseKeys[index] === key
    ) {
      return index
    }
  }

  has(key: number): boolean {
    const index = this.sparse[key]
    return index !== undefined
        && index < this.denseKeys.length // 用于改善JIT优化.
        && this.denseKeys[index] === key
  }

  get(key: number): T | undefined {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      index < this.denseKeys.length && // 用于改善JIT优化.
      this.denseKeys[index] === key
    ) {
      return this.denseValues[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: T): void {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      index < this.denseKeys.length && // 用于改善JIT优化.
      this.denseKeys[index] === key
    ) {
      this.denseValues[index] = value
    } else {
      const index = this.denseKeys.length
      this.denseKeys.push(key)
      this.denseValues.push(value)
      this.sparse[key] = index
    }
  }

  delete(key: number): boolean {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      index < this.denseKeys.length && // 用于改善JIT优化.
      this.denseKeys[index] === key
    ) {
      const lastKey = this.denseKeys.pop()!
      const lastValue = this.denseValues.pop()!
      if (key !== lastKey) {
        this.denseKeys[index] = lastKey
        this.denseValues[index] = lastValue
        this.sparse[lastKey] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.denseKeys.length = 0
    this.denseValues.length = 0
    // 无需清空sparse数组.
  }
}
