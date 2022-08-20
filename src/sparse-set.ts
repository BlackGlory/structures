import { UnsignedTypedArrayConstructor } from 'justypes'
import { DynamicTypedArray } from './dynamic-typed-array'

export interface ISparseSetOptions {
  capacity?: number
  growthFactor?: number
}

export class SparseSet<T extends UnsignedTypedArrayConstructor> implements Iterable<number> {
  private valueToIndex: DynamicTypedArray<typeof Uint32Array>
  private indexToValue: DynamicTypedArray<T>

  constructor(
    typedArrayConstructor: T
  , { capacity = 0, growthFactor = 1.5 }: ISparseSetOptions = {}
  ) {
    this.indexToValue = new DynamicTypedArray(typedArrayConstructor, { capacity, growthFactor })
    this.valueToIndex = new DynamicTypedArray(Uint32Array, { capacity, growthFactor })
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.indexToValue.internalTypedArray[Symbol.iterator]()
  }

  has(value: number): boolean {
    const index = this.valueToIndex.internalTypedArray[value]
    return this.indexToValue.internalTypedArray[index] === value
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.indexToValue.length
      this.indexToValue.push(value)
      this.valueToIndex.set(value, index)
    }
  }

  delete(value: number): void {
    const index = this.valueToIndex.internalTypedArray[value]
    if (this.indexToValue.internalTypedArray[index] === value) {
      const lastValue = this.indexToValue.pop()!
      if (value !== lastValue) {
        this.indexToValue.internalTypedArray[index] = lastValue
        this.valueToIndex.internalTypedArray[lastValue] = index
      }
    }
  }
}
