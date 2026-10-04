export class SparseSet implements Iterable<number> {
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
    if (this.has(value)) {
      const lastValue = this.dense.pop()!
      if (value === lastValue) {
        this.sparse[value] = undefined
      } else {
        const index = this.sparse[value]!
        this.dense[index] = lastValue
        this.sparse[lastValue] = index
        this.sparse[value] = undefined
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

  clone(): SparseSet {
    const clone = new SparseSet()

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
