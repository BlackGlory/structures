export class SparseSet {
  private values: number[] = []
  private valueToValueIndex: Array<number | undefined> = []

  ;* [Symbol.iterator](): Generator<number, void, void> {
    for (const value of this.values) {
      yield value
    }
  }

  has(value: number): boolean {
    // 跟一般的实现不同, 不需要访问values数组.
    return this.valueToValueIndex[value] !== undefined
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.values.length
      this.values.push(value)
      this.valueToValueIndex[value] = index
    }
  }

  remove(value: number): void {
    if (this.has(value)) {
      const lastValue = this.values.pop()!
      if (value !== lastValue) {
        const indexOfValue = this.valueToValueIndex[value]!
        this.values[indexOfValue] = lastValue
        this.valueToValueIndex[lastValue] = indexOfValue
        // 跟一般的实现不同, 直接删除值的索引.
        this.valueToValueIndex[value] = undefined
      }
    }
  }
}
