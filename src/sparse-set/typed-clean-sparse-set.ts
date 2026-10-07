import { assert } from '@blackglory/errors'
import { go } from '@blackglory/go'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@src/typed-array.js'
import { UnsignedTypedArray } from 'justypes'

export class TypedCleanSparseSet implements Iterable<number> {
  private dense: UnsignedTypedArray
  private sparse: UnsignedTypedArray
  private readonly NULL: number
  #length = 0

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.#length
  }

  constructor(array: UnsignedTypedArray<ArrayBuffer>) {
    assert(!array.buffer.resizable, 'The array buffer must not be resizable')

    this.dense = array

    const NULL = Math.min(
      array.length
    , getMaxValueOfUnsignedTypedArray(array) + 1
    )
    this.NULL = NULL

    const sparseConstructor = go(() => {
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
    const sparse = new sparseConstructor(getMaxValueOfUnsignedTypedArray(array) + 1)
    sparse.fill(NULL)
    this.sparse = sparse
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this.#length; i++) {
      yield this.dense[i]
    }
  }

  has(value: number): boolean {
    return this.sparse[value] !== this.NULL
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.#length++
      this.dense[index] = value
      this.sparse[value] = index
    }
  }

  delete(value: number): boolean {
    const index = this.sparse[value]
    if (index !== this.NULL) {
      this.sparse[value] = this.NULL

      const lastIndex = --this.#length
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
    this.#length = 0
    this.sparse.fill(this.NULL)
  }
}
