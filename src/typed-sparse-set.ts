import { UnsignedTypedArrayConstructor } from 'justypes'
import { DynamicTypedArray } from './dynamic-typed-array'

export class TypedSparseSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private valueToIndex: number[]
  private indexToValue: DynamicTypedArray<T>

  constructor(array: DynamicTypedArray<T>) {
    const valueToIndex: number[] = []
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

  * values(): IterableIterator<number> {
    for (let i = 0; i < this.indexToValue.length; i++) {
      yield this.indexToValue.internalTypedArray[i]
    }
  }

  has(value: number): boolean {
    const index = this.valueToIndex[value]
    return this.indexToValue.internalTypedArray[index] === value
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.indexToValue.length
      this.indexToValue.push(value)
      this.valueToIndex[value] = index
    }
  }

  delete(value: number): void {
    const index = this.valueToIndex[value]
    if (this.indexToValue.internalTypedArray[index] === value) {
      const lastValue = this.indexToValue.pop()!
      if (value !== lastValue) {
        this.indexToValue.internalTypedArray[index] = lastValue
        this.valueToIndex[lastValue] = index
      }
    }
  }
}
