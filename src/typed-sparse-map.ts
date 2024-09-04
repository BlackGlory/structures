import { assert } from '@blackglory/errors'
import { TypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { DynamicTypedArray } from './dynamic-typed-array.js'

export class TypedSparseMap<T extends TypedArrayConstructor> {
  private keyToIndex: Array<number | undefined> = []
  private indexToKey: number[] = []
  private indexToValue: DynamicTypedArray<T>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.indexToKey.length
  }

  get internalTypedArray(): TypedArrayOfConstructor<T> {
    return this.indexToValue.internalTypedArray
  }

  constructor(array: DynamicTypedArray<T>) {
    assert(array.length === 0, 'array should be empty')

    this.indexToValue = array
  }

  * entries(): IterableIterator<[key: number, value: number]> {
    for (let i = 0; i < this.indexToKey.length; i++) {
      yield [
        this.indexToKey[i]
      , this.indexToValue.internalTypedArray[i]
      ]
    }
  }

  keys(): IterableIterator<number> {
    return this.indexToKey.values()
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this.indexToKey.length; i++) {
      yield this.indexToValue.internalTypedArray[i]
    }
  }

  getInternalIndexOfKey(key: number): number | undefined {
    return this.keyToIndex[key]
  }

  has(key: number): boolean {
    return this.keyToIndex[key] !== undefined
  }

  get(key: number): number | undefined {
    if (this.has(key)) {
      const index = this.keyToIndex[key]!
      return this.indexToValue.internalTypedArray[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: number): void {
    if (this.has(key)) {
      const index = this.keyToIndex[key]!
      this.indexToValue.internalTypedArray[index] = value
    } else {
      const index = this.indexToKey.length
      this.indexToKey.push(key)
      this.indexToValue.push(value)
      this.keyToIndex[key] = index
    }
  }

  delete(key: number): void {
    if (this.has(key)) {
      const lastKey = this.indexToKey.pop()!
      const lastValue = this.indexToValue.pop()!
      if (key === lastKey) {
        this.keyToIndex[key] = undefined
      } else {
        const index = this.keyToIndex[key]!
        this.indexToKey[index] = lastKey
        this.indexToValue.internalTypedArray[index] = lastValue
        this.keyToIndex[lastKey] = index
        this.keyToIndex[key] = undefined
      }
    }
  }

  clear(): void {
    this.keyToIndex.length = 0
    this.indexToKey.length = 0
    this.indexToValue.clear()
  }
}
