export class SparseSet implements Iterable<number> {
  private indexToValue: number[] = []
  private valueToIndex: Array<number | undefined>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.indexToValue[Symbol.iterator]()
  }

  get size(): number {
    return this.indexToValue.length
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
    return this.valueToIndex[value] !== undefined
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
