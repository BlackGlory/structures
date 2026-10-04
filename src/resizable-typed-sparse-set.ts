import { UnsignedTypedArrayConstructor } from 'justypes'
import { ResizableTypedArray } from './resizable-typed-array.js'
import { assert } from '@blackglory/errors'

export class ResizableTypedSparseSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private dense: ResizableTypedArray<T>
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: ResizableTypedArray<T>) {
    assert(array.length === 0, 'The parameter array must be empty')

    this.dense = array
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this.dense.length; i++) {
      yield this.dense.internalTypedArray[i]
    }
  }

  has(value: number): boolean {
    return this.sparse[value] !== undefined
  }

  add(value: number): void {
    if (!this.has(value)) {
      const index = this.dense.length
      this.dense.push(value)
      this.sparse[value] = index
    }
  }

  delete(value: number): boolean {
    if (this.has(value)) {
      const lastValue = this.dense.pop()!
      if (value === lastValue) {
        this.sparse[value] = undefined
      } else {
        const index = this.sparse[value]!
        this.dense.internalTypedArray[index] = lastValue
        this.sparse[lastValue] = index
        this.sparse[value] = undefined
      }
      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.sparse.length = 0
    this.dense.clear()
  }
}
