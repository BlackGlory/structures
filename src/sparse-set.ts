import { isntUndefined } from '@blackglory/types'

export class SparseSet implements Iterable<number> {
  private values: number[] = []
  private valueToValueIndex: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values[Symbol.iterator]()
  }

  has(value: number): boolean {
    // 跟一般的实现不同, 不需要访问values数组.
    return isntUndefined(this.valueToValueIndex[value])
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
