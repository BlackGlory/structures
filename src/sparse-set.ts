export class SparseSet implements Iterable<number> {
  private indexToValue: number[] = []
  private valueToIndex: Array<number | undefined>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.indexToValue[Symbol.iterator]()
  }

  constructor(array: number[] = []) {
    const valueToIndex: Array<number | undefined> = []
    if (array.length > 0) {
      for (const [index, value] of array.entries()) {
        valueToIndex[value] = index
      }
    }

    this.valueToIndex = valueToIndex
  }

  values(): IterableIterator<number> {
    return this.indexToValue[Symbol.iterator]()
  }

  has(value: number): boolean {
    // 跟一般的实现不同, 不需要访问values数组.
    return value in this.valueToIndex
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.indexToValue.length
      this.indexToValue.push(value)
      this.valueToIndex[value] = index
    }
  }

  delete(value: number): boolean {
    if (this.has(value)) {
      const lastValue = this.indexToValue.pop()!
      if (value === lastValue) {
        delete this.valueToIndex[value]
      } else {
        const index = this.valueToIndex[value]!
        this.indexToValue[index] = lastValue
        this.valueToIndex[lastValue] = index
        // 跟一般的实现不同, 直接删除值的索引.
        delete this.valueToIndex[value]
      }
      return true
    } else {
      return false
    }
  }
}
