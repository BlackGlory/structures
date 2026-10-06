import { assert } from '@blackglory/errors'
import { go } from '@blackglory/go'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@utils/get-max-value-of-unsigned-typed-array.js'
import { TypedArrayOfConstructor, UnsignedTypedArrayConstructor } from 'justypes'

export class TypedSparseSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private dense: TypedArrayOfConstructor<T, ArrayBuffer>
  private sparse: TypedArrayOfConstructor<T, ArrayBuffer>
  #length = 0

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.#length
  }

  constructor(array: TypedArrayOfConstructor<T, ArrayBuffer>) {
    assert(!array.buffer.resizable, 'The array buffer must not be resizable')

    this.dense = array

    const sparseConstructor = go(() => {
      const maxIndex = array.length - 1
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
    this.sparse = new sparseConstructor(
      getMaxValueOfUnsignedTypedArray(array) + 1
    ) as TypedArrayOfConstructor<T, ArrayBuffer>
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
    const index = this.sparse[value]
    return index !== undefined
        && index < this.#length
        && index < this.dense.length // 用于改善JIT优化.
        && this.dense[index] === value
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
    if (
      index !== undefined &&
      index < this.#length &&
      index < this.dense.length && // 用于改善JIT优化.
      this.dense[index] === value
    ) {
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
    // 无需清空dense和sparse数组.
  }
}
