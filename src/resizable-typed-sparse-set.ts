import { UnsignedTypedArrayConstructor } from 'justypes'
import { ResizableTypedArray } from './resizable-typed-array.js'
import { assert } from '@blackglory/errors'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@utils/get-max-value-of-unsigned-typed-array.js'
import { go } from '@blackglory/go'

export class ResizableTypedSparseSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private dense: ResizableTypedArray<T>
  private sparse: ResizableTypedArray<UnsignedTypedArrayConstructor>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: ResizableTypedArray<T>) {
    assert(array.length === 0, 'The array must be empty')
    assert(
      array.maxCapacity <= getMaxValueOfUnsignedTypedArray(array.internalTypedArray) + 1
    , 'The array.maxCapacity is greater than the required capacity'
    )

    this.dense = array

    const sparseConstructor = go(() => {
      if (
        array.maxCapacity <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint8Array)
      ) {
        return Uint8Array
      } else if (
        array.maxCapacity <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint16Array)
      ) {
        return Uint16Array
      } else {
        return Uint32Array
      }
    })
    this.sparse = new ResizableTypedArray(sparseConstructor, {
      maxCapacity: getMaxValueOfUnsignedTypedArray(array.internalTypedArray) + 1
    })
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this.dense.length; i++) {
      yield this.dense.internalTypedArray[i]
    }
  }

  has(value: number): boolean {
    const index = this.sparse.get(value)
    return index !== undefined
        && index < this.dense.length // 用于改善JIT优化.
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
      index < this.dense.length && // 用于改善JIT优化.
      this.dense.get(index) === value
    ) {
      const lastValue = this.dense.pop()!
      if (value !== lastValue) {
        this.dense.set(index, lastValue)
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
