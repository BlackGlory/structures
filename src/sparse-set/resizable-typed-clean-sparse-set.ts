import { UnsignedTypedArrayConstructor } from 'justypes'
import { ResizableTypedArray } from '@src/resizable-typed-array.js'
import { assert } from '@blackglory/errors'

export class ResizableTypedCleanSparseSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private dense: ResizableTypedArray<T>

  // 理论上, 这也可以是`ResizableTypedArray`.
  // 为了存储NULL值, `ResizableTypedArray`需具备在调整大小后填充NULL值的特性,
  // 这对通用的`ResizableTypedArray`实现而言是一项太大的负担.
  // 为实现该功能, 将不得不为此专门维护一个`ResizableTypedArray`实现.
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  constructor(array: ResizableTypedArray<T>) {
    assert(array.length === 0, 'The array must be empty')

    this.dense = array
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  values(): IterableIterator<number> {
    return this.dense.values()
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
    const index = this.sparse[value]
    if (index !== undefined) {
      this.sparse[value] = undefined

      const lastValue = this.dense.pop()!
      if (value !== lastValue) {
        this.dense.internalTypedArray[index] = lastValue
        this.sparse[lastValue] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.dense.clear()
    this.sparse.length = 0
  }
}
