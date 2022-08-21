import { DynamicTypedArray } from './dynamic-typed-array'
import { assert } from '@blackglory/errors'

export class BitSet {
  private length = 0
  private array = new DynamicTypedArray(Uint8Array) // 经测试, 比Uint32Array快

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.length
  }

  has(value: number): boolean {
    const { index, mask } = this.getPosition(value)

    return ((this.array.get(index) ?? 0) & mask) === mask
  }

  add(value: number): void {
    assert(value >= 0, 'value must be greater than or equal to 0')
    if (value >= this.length) {
      this.length = value + 1
    }

    const { index, mask } = this.getPosition(value)

    this.array.set(index, (this.array.get(index) ?? 0) | mask)
  }

  delete(value: number): void {
    const { index, mask } = this.getPosition(value)

    this.array.set(index, (this.array.get(index) ?? 0) & ~mask)
  }

  clear(): void {
    for (let i = this.array.length; i--;) {
      this.array.set(i, 0)
    }
  }

  private getPosition(value: number): { index: number; mask: number } {
    const bits = Uint8Array.BYTES_PER_ELEMENT * 8
    const remainder = value % bits
    const quotient = (value - remainder) / bits
    const index = Math.max(0, quotient - 1)
    const mask = this.getMask(value)
    return { index, mask }
  }

  private getMask(value: number): number {
    return 2 ** value
  }
}
