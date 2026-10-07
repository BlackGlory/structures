import { assert } from '@blackglory/errors'
import { go } from '@blackglory/go'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@src/typed-array.js'
import { TypedArrayConstructor, UnsignedTypedArrayConstructor, TypedArrayOfConstructor, UnsignedTypedArray } from 'justypes'

export class TypedCleanSparseMap<
  K extends UnsignedTypedArrayConstructor
, V extends TypedArrayConstructor
> {
  private denseKeys: TypedArrayOfConstructor<K>
  private denseValues: TypedArrayOfConstructor<V>
  private sparse: UnsignedTypedArray
  private readonly NULL: number
  private _length = 0

  readonly internalKeyArray: TypedArrayOfConstructor<K, ArrayBuffer>
  readonly internalValueArray: TypedArrayOfConstructor<V, ArrayBuffer>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this._length
  }

  constructor(
    keys: TypedArrayOfConstructor<K, ArrayBuffer>
  , values: TypedArrayOfConstructor<V, ArrayBuffer>
  ) {
    assert(!keys.buffer.resizable, 'The keys buffer must not be resizable')
    assert(!values.buffer.resizable, 'The values buffer must not be resizable')
    assert(
      values.length >= keys.length
    , 'The values.length must greater than or equal to keys.length'
    )

    this.denseKeys = keys
    this.denseValues = values

    this.internalKeyArray = keys
    this.internalValueArray = values

    const NULL = Math.min(
      keys.length
    , getMaxValueOfUnsignedTypedArray(keys) + 1
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
    const sparse = new sparseConstructor(getMaxValueOfUnsignedTypedArray(keys) + 1)
    sparse.fill(NULL)
    this.sparse = sparse
  }

  * entries(): IterableIterator<[key: number, value: number]> {
    for (let i = 0; i < this._length; i++) {
      yield [
        this.denseKeys[i]
      , this.denseValues[i]
      ]
    }
  }

  * keys(): IterableIterator<number> {
    for (let i = 0; i < this._length; i++) {
      yield this.denseKeys[i]
    }
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this._length; i++) {
      yield this.denseValues[i]
    }
  }

  getInternalIndexOfKey(key: number): number | undefined {
    return this.sparse[key]
  }

  has(key: number): boolean {
    return this.sparse[key] !== this.NULL
  }

  get(key: number): number | undefined {
    const index = this.sparse[key]
    if (index !== this.NULL) {
      return this.denseValues[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: number): void {
    const index = this.sparse[key]
    if (index !== this.NULL) {
      this.denseValues[index] = value
    } else {
      const index = this._length++
      this.denseKeys[index] = key
      this.denseValues[index] = value
      this.sparse[key] = index
    }
  }

  delete(key: number): boolean {
    const index = this.sparse[key]
    if (index !== this.NULL) {
      this.sparse[key] = this.NULL

      const lastIndex = --this._length
      const lastKey = this.denseKeys[lastIndex]
      const lastValue = this.denseValues[lastIndex]
      if (key !== lastKey) {
        this.denseKeys[index] = lastKey
        this.denseValues[index] = lastValue
        this.sparse[lastKey] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this._length = 0
    this.sparse.fill(this.NULL)
  }
}
