import { isUndefined } from '@blackglory/types'

export class SparseSet implements Iterable<number> {
  private values: number[] = []
  private valueToValueIndex: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  *[Symbol.iterator](): IterableIterator<number> {
    for (const value of this.values) {
      yield value
    }
  }

  has(value: number): boolean {
    const index = this.valueToValueIndex[value]
    return isUndefined(index)
         ? false
         : this.values[index] === value
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
      }
    }
  }
}
