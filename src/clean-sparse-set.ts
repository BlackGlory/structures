/**
 * 稀疏集的干净sparse数组变体.
 * 
 * `has()`和`add()`快于标准实现, `delete()`和`clear()`慢于标准实现.
 */
export class CleanSparseSet implements Iterable<number> {
  private dense: number[] = []
  private sparse: Array<number | undefined> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.dense.length
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.dense[Symbol.iterator]()
  }

  values(): IterableIterator<number> {
    return this.dense[Symbol.iterator]()
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
        this.dense[index] = lastValue
        this.sparse[lastValue] = index
      }

      return true
    } else {
      return false
    }
  }

  clear(): void {
    this.dense.length = 0
    this.sparse.length = 0
  }

  clone(): CleanSparseSet {
    const clone = new CleanSparseSet()

    const dense = [...this.dense]

    // 由于`sparse`是稀疏的, 不应用`[...sparse]`复制.
    const sparse: Array<number | undefined> = []
    for (const [index, value] of dense.entries()) {
      sparse[value] = index
    }

    clone.dense = dense
    clone.sparse = sparse

    return clone
  }
}
