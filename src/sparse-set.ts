import { assert } from '@blackglory/errors'

export class SparseSet implements Iterable<number> {
  private indexToValue: number[] = []
  private valueToIndex: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.indexToValue.length
  }

  constructor() {}

  [Symbol.iterator](): IterableIterator<number> {
    return this.indexToValue[Symbol.iterator]()
  }

  values(): IterableIterator<number> {
    return this.indexToValue[Symbol.iterator]()
  }

  has(value: number): boolean {
    return this.valueToIndex[value] !== undefined
  }

  add(value: number): void {
    assert(value >= 0, 'The value must be greater than or equal to 0')

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
        this.valueToIndex[value] = undefined
      } else {
        const index = this.valueToIndex[value]!
        this.indexToValue[index] = lastValue
        this.valueToIndex[lastValue] = index
        this.valueToIndex[value] = undefined
      }
      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.indexToValue.length = 0
    this.valueToIndex.length = 0
  }

  clone(): SparseSet {
    const clone = new SparseSet()

    clone.indexToValue = [...this.indexToValue]
    clone.valueToIndex = [...this.valueToIndex]

    return clone
  }
}
