import { UnsignedTypedArrayConstructor } from 'justypes'
import { DynamicTypedArray } from '@src/dynamic-typed-array.js'
import { assert } from '@blackglory/errors'
import { go } from '@blackglory/go'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@src/typed-array.js'

export class DynamicTypedSparseSet implements Iterable<number> {
  private dense: DynamicTypedArray<UnsignedTypedArrayConstructor>
  private sparse: DynamicTypedArray<UnsignedTypedArrayConstructor>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: DynamicTypedArray<UnsignedTypedArrayConstructor>) {
    assert(array.length === 0, 'The array must be empty')

    this.dense = array

    const sparseInternalArrayConstructor = go(() => {
      const maxIndex = getMaxValueOfUnsignedTypedArray(array.internalTypedArray)
                     + 1
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
    this.sparse = new DynamicTypedArray(sparseInternalArrayConstructor)
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

  add(value: number): boolean {
    if (!this.has(value)) {
      const index = this.dense.length
      this.dense.push(value)
      this.sparse.set(value, index)

      return true
    } else {
      return false
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
