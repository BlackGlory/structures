import { UnsignedTypedArrayConstructor } from 'justypes'
import { ResizableTypedArray } from '@src/resizable-typed-array.js'
import { assert } from '@blackglory/errors'
import { go } from '@blackglory/go'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@utils/get-max-value-of-unsigned-typed-array.js'

export class ResizableTypedCleanSparseSet implements Iterable<number> {
  private dense: ResizableTypedArray<UnsignedTypedArrayConstructor>
  private sparse: ResizableTypedArray<UnsignedTypedArrayConstructor>
  private readonly NULL: number

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: ResizableTypedArray<UnsignedTypedArrayConstructor>) {
    assert(array.length === 0, 'The array must be empty')

    this.dense = array

    const NULL = Math.min(
      array.maxCapacity
    , getMaxValueOfUnsignedTypedArray(array.internalTypedArray) + 1
    )
    this.NULL = NULL

    const sparseInternalArrayConstructor = go(() => {
      if (
        NULL <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint8Array)
      ) {
        return Uint8Array
      } else if (
        NULL <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint16Array)
      ) {
        return Uint16Array
      } else if (
        NULL <=
        getMaxValueOfUnsignedTypedArrayConstructor(Uint32Array)
      ) {
        return Uint32Array
      } else {
        throw new Error('The array is too large')
      }
    })
    const sparse = new ResizableTypedArray(
      sparseInternalArrayConstructor
    , {
        maxCapacity: getMaxValueOfUnsignedTypedArray(array.internalTypedArray)
                   + 1
      , fillValue: NULL
      }
    )
    this.sparse = sparse
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
        && index !== this.NULL
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
      index !== this.NULL
    ) {
      this.sparse.internalTypedArray[value] = this.NULL

      const lastValue = this.dense.pop()!
      if (value !== lastValue) {
        this.dense.internalTypedArray[index] = lastValue
        this.sparse.internalTypedArray[lastValue] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.dense.clear()
    this.sparse.clear()
  }
}
