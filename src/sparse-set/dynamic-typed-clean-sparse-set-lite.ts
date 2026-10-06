import { UnsignedTypedArrayConstructor } from 'justypes'
import { DynamicTypedArray } from '@src/dynamic-typed-array.js'
import { assert } from '@blackglory/errors'

export class DynamicTypedCleanSparseSetLite<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private dense: DynamicTypedArray<T>
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: DynamicTypedArray<T>) {
    assert(array.length === 0, 'The array must be empty')

    this.dense = array
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  values(): IterableIterator<number> {
    return this.dense.values()
  }

  has(value: number): boolean {
    return this.sparse[value] !== undefined
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.dense.length
      this.dense.push(value)
      this.sparse[value] = index
    }
  }

  delete(value: number): boolean {
    const index = this.sparse[value]
    if (index !== undefined) {
      this.sparse[value] = undefined

      const lastValue = this.dense.pop()!
      if (value !== lastValue) {
        this.dense.internalTypedArray[index] = lastValue
        this.sparse[lastValue] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.dense.clear()
    this.sparse.length = 0
  }
}
