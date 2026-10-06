import { assert } from '@blackglory/errors'
import { TypedArrayConstructor, UnsignedTypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { ResizableTypedArray } from '@src/resizable-typed-array.js'

export class ResizableTypedCleanSparseMapLite<
  K extends UnsignedTypedArrayConstructor
, V extends TypedArrayConstructor
> {
  private denseKeys: ResizableTypedArray<K>
  private denseValues: ResizableTypedArray<V>
  private sparse: Array<number | undefined> = []

  readonly internalKeyArray: TypedArrayOfConstructor<K>
  readonly internalValueArray: TypedArrayOfConstructor<V>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.denseKeys.length
  }

  constructor(
    keys: ResizableTypedArray<K>
  , values: ResizableTypedArray<V>
  ) {
    assert(keys.length === 0, 'keys must be empty')

    this.denseKeys = keys
    this.denseValues = values

    this.internalKeyArray = keys.internalTypedArray
    this.internalValueArray = values.internalTypedArray
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
    return this.sparse[key]
  }

  has(key: number): boolean {
    return this.sparse[key] !== undefined
  }

  get(key: number): number | undefined {
    const index = this.sparse[key]
    if (index !== undefined) {
      return this.denseValues.internalTypedArray[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: number): void {
    const index = this.sparse[key]
    if (index !== undefined) {
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
    if (index !== undefined) {
      this.sparse[key] = undefined

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
    this.sparse.length = 0
  }
}
