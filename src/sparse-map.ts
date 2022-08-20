import { DynamicTypedArray } from './dynamic-typed-array'

export class SparseMap<T> {
  private keyToIndex = new DynamicTypedArray(Uint32Array)
  private indexToKey =  new DynamicTypedArray(Uint32Array)
  private indexToValue: T[] = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  * entries(): Iterable<[key: number, value: T]> {
    for (let i = 0; i < this.indexToKey.length; i++) {
      yield [
        this.indexToKey.internalTypedArray[i]
      , this.indexToValue[i]
      ]
    }
  }

  keys(): Iterable<number> {
    return this.indexToKey.internalTypedArray.values()
  }

  values(): Iterable<T> {
    return this.indexToValue.values()
  }

  has(key: number): boolean {
    const index = this.keyToIndex.internalTypedArray[key]
    return this.indexToKey.internalTypedArray[index] === key
  }

  get(key: number): T | undefined {
    const index = this.keyToIndex.internalTypedArray[key]
    if (this.indexToKey.internalTypedArray[index] === key) {
      return this.indexToValue[index]
    } else {
      return undefined
    }
  }

  set(key: number, value: T): void {
    const index = this.keyToIndex.internalTypedArray[key]
    if (this.indexToKey.internalTypedArray[index] === key) {
      this.indexToValue[index] = value
    } else {
      const index = this.indexToKey.length
      this.indexToKey.push(key)
      this.indexToValue.push(value)
      this.keyToIndex.set(key, index)
    }
  }

  delete(key: number): void {
    const index = this.keyToIndex.internalTypedArray[key]
    if (this.indexToKey.internalTypedArray[index] === key) {
      const lastKey = this.indexToKey.pop()!
      const lastValue = this.indexToValue.pop()!
      if (key !== lastKey) {
        this.indexToKey.internalTypedArray[index] = lastKey
        this.indexToValue[index] = lastValue
        this.keyToIndex.internalTypedArray[lastKey] = index
      }
    }
  }
}
