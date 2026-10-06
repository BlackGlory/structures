import { assert } from '@blackglory/errors'
import { TypedArrayConstructor, UnsignedTypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { DynamicTypedArray } from '@src/dynamic-typed-array.js'

export class DynamicTypedSparseMapLite<
  K extends UnsignedTypedArrayConstructor
, V extends TypedArrayConstructor
> {
  private denseKeys: DynamicTypedArray<K>
  private denseValues: DynamicTypedArray<V>
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.denseKeys.length
  }

  get internalKeyArray(): TypedArrayOfConstructor<K> {
    return this.denseKeys.internalTypedArray
  }

  get internalValueArray(): TypedArrayOfConstructor<V> {
    return this.denseValues.internalTypedArray
  }

  constructor(
    keys: DynamicTypedArray<K>
  , values: DynamicTypedArray<V>
  ) {
    assert(keys.length === 0, 'keys must be empty')

    this.denseKeys = keys
    this.denseValues = values
  }

  * entries(): IterableIterator<[key: number, value: number]> {
    for (let i = 0; i < this.denseKeys.length; i++) {
      yield [
        this.denseKeys.internalTypedArray[i]
      , this.denseValues.internalTypedArray[i]
      ]
    }
  }

  keys(): IterableIterator<number> {
    return this.denseKeys.values()
  }

  values(): IterableIterator<number> {
    return this.denseValues.values()
  }

  getInternalIndexOfKey(key: number): number | undefined {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      this.denseKeys.get(index) === key
    ) {
      return index
    }
  }

  has(key: number): boolean {
    const index = this.sparse[key]
    return index !== undefined
        && this.denseKeys.get(index) === key
  }

  get(key: number): number | undefined {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      this.denseKeys.get(index) === key
    ) {
      return this.denseValues.internalTypedArray[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: number): void {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      this.denseKeys.get(index) === key
    ) {
      this.denseValues.internalTypedArray[index] = value
    } else {
      const index = this.denseKeys.length
      this.denseKeys.push(key)
      this.denseValues.push(value)
      this.sparse[key] = index
    }
  }

  delete(key: number): boolean {
    const index = this.sparse[key]
    if (
      index !== undefined &&
      this.denseKeys.get(index) === key
    ) {
      const lastKey = this.denseKeys.pop()!
      const lastValue = this.denseValues.pop()!
      if (key !== lastKey) {
        this.denseKeys.internalTypedArray[index] = lastKey
        this.denseValues.internalTypedArray[index] = lastValue
        this.sparse[lastKey] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.denseKeys.clear()
    this.denseValues.clear()
    // 无需清空sparse数组.
  }
}
