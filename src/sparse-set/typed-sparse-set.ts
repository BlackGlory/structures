import { assert } from '@blackglory/errors'
import { go } from '@blackglory/go'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@src/typed-array.js'
import { UnsignedTypedArray } from 'justypes'

export class TypedSparseSet implements Iterable<number> {
  private dense: UnsignedTypedArray
  private sparse: UnsignedTypedArray
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

    const sparseConstructor = go(() => {
      const maxIndex = Math.min(
        array.length - 1
      , getMaxValueOfUnsignedTypedArray(array) + 1
      )
      if (
        maxIndex <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint8Array)
      ) {
        return Uint8Array
      } else if (
        maxIndex <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint16Array)
      ) {
        return Uint16Array
      } else if (
        maxIndex <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint32Array)
      ) {
        return Uint32Array
      } else {
        throw new Error('The array is too large')
      }
    })
    this.sparse = new sparseConstructor(getMaxValueOfUnsignedTypedArray(array) + 1)
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
