import { UnsignedTypedArrayConstructor } from 'justypes'
import { DynamicTypedArray } from '@src/dynamic-typed-array.js'
import { assert } from '@blackglory/errors'

export class DynamicTypedSparseSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private dense: DynamicTypedArray<T>
  private sparse: DynamicTypedArray<Uint32ArrayConstructor> = new DynamicTypedArray(Uint32Array)

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
    const index = this.sparse.get(value)
    return index !== undefined
        && this.dense.get(index) === value
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.dense.length
      this.dense.push(value)
      this.sparse.set(value, index)
    }
  }

  delete(value: number): boolean {
    const index = this.sparse.get(value)
    if (
      index !== undefined &&
      this.dense.get(index) === value
    ) {
      const lastValue = this.dense.pop()!
      if (value !== lastValue) {
        this.dense.internalTypedArray[index] = lastValue
        this.sparse.set(lastValue, index)
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
