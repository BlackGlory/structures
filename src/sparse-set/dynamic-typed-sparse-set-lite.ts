import { DynamicTypedArray } from '@src/dynamic-typed-array.js'
import { assert } from '@blackglory/errors'
import { UnsignedTypedArrayConstructor } from 'justypes'

export class DynamicTypedSparseSetLite implements Iterable<number> {
  private dense: DynamicTypedArray<UnsignedTypedArrayConstructor>
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: DynamicTypedArray<UnsignedTypedArrayConstructor>) {
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
    const index = this.sparse[value]
    return index !== undefined
        && this.dense.get(index) === value
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
    if (
      index !== undefined &&
      this.dense.get(index) === value
    ) {
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
    // 无需清空sparse数组.
  }
}
