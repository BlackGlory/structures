import { UnsignedTypedArrayConstructor } from 'justypes'
import { DynamicTypedArray } from './dynamic-typed-array.js'

export class TypedSparseSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private valueToIndex: Array<number | undefined>
  private indexToValue: DynamicTypedArray<T>

  constructor(array: DynamicTypedArray<T>) {
    const valueToIndex: Array<number | undefined> = []
    if (array.length > 0) {
      for (const [index, value] of array.internalTypedArray.entries()) {
        valueToIndex[value] = index
      }
    }

    this.indexToValue = array
    this.valueToIndex = valueToIndex
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  get size(): number {
    return this.indexToValue.length
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this.indexToValue.length; i++) {
      yield this.indexToValue.internalTypedArray[i]
    }
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
        this.indexToValue.internalTypedArray[index] = lastValue
        this.valueToIndex[lastValue] = index
        this.valueToIndex[value] = undefined
      }
      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.valueToIndex.length = 0
    this.indexToValue.clear()
  }
}
