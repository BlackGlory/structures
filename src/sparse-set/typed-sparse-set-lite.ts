import { assert } from '@blackglory/errors'
import { UnsignedTypedArray } from 'justypes'

export class TypedSparseSetLite implements Iterable<number> {
  private dense: UnsignedTypedArray
  private sparse: Array<number | undefined> = []
  private _length = 0

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this._length
  }

  constructor(array: UnsignedTypedArray<ArrayBuffer>) {
    assert(!array.buffer.resizable, 'The array buffer must not be resizable')

    this.dense = array
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this._length; i++) {
      yield this.dense[i]
    }
  }

  has(value: number): boolean {
    const index = this.sparse[value]
    return index !== undefined
        && index < this._length
        && index < this.dense.length // 用于改善JIT优化.
        && this.dense[index] === value
  }

  add(value: number): boolean {
    if (!this.has(value)) {
      const index = this._length++
      this.dense[index] = value
      this.sparse[value] = index

      return true
    } else {
      return false
    }
  }

  delete(value: number): boolean {
    const index = this.sparse[value]
    if (
      index !== undefined &&
      index < this._length &&
      index < this.dense.length && // 用于改善JIT优化.
      this.dense[index] === value
    ) {
      const lastIndex = --this._length
      const lastValue = this.dense[lastIndex]
      if (value !== lastValue) {
        this.dense[index] = lastValue
        this.sparse[lastValue] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this._length = 0
    // 无需清空dense和sparse数组.
  }
}
