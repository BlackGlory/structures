import { assert } from '@blackglory/errors'
import { TypedArrayConstructor, UnsignedTypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'

export class TypedCleanSparseMapLite<
  K extends UnsignedTypedArrayConstructor
, V extends TypedArrayConstructor
> {
  private denseKeys: TypedArrayOfConstructor<K>
  private denseValues: TypedArrayOfConstructor<V>
  private sparse: Array<number | undefined> = []
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
    return this.sparse[key] !== undefined
  }

  get(key: number): number | undefined {
    const index = this.sparse[key]
    if (index !== undefined) {
      return this.denseValues[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: number): void {
    const index = this.sparse[key]
    if (index !== undefined) {
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
    if (index !== undefined) {
      this.sparse[key] = undefined

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
    this.sparse.length = 0
  }
}
