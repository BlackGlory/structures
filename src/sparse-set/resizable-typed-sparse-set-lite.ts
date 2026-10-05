import { UnsignedTypedArrayConstructor } from 'justypes'
import { ResizableTypedArray } from '@src/resizable-typed-array.js'
import { assert } from '@blackglory/errors'

export class ResizableTypedSparseSetLite<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private dense: ResizableTypedArray<T>
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: ResizableTypedArray<T>) {
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
        && index < this.dense.length // 用于改善JIT优化.
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
      index < this.dense.length && // 用于改善JIT优化.
      this.dense.get(index) === value
    ) {
      const lastValue = this.dense.pop()!
      if (value !== lastValue) {
        this.dense.set(index, lastValue)
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
