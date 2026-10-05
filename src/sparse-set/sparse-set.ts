/**
 * 稀疏集的标准实现.
 */
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
    return this.values()
  }

  values(): IterableIterator<number> {
    return this.dense.values()
  }

  has(value: number): boolean {
    const index = this.sparse[value]
    return index !== undefined
        && index < this.dense.length // 用于改善JIT优化.
        && this.dense[index] === value
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
    if (
      index !== undefined &&
      index < this.dense.length && // 用于改善JIT优化.
      this.dense[index] === value
    ) {
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
    // 无需清空sparse数组.
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
