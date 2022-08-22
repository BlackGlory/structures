import { DynamicTypedArray } from './dynamic-typed-array'
import { assert } from '@blackglory/errors'

export class BitSet {
  private length = 0
  private array = new DynamicTypedArray(Uint8Array)

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.length
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this.length; i++) {
      if (this.has(i)) {
        yield i
      }
    }
  }

  _dumpBinaryStrings(): string[] {
    const result: string[] = []
    const expectedBinaryStringLength = Uint8Array.BYTES_PER_ELEMENT * 8
    for (let i = 0; i < this.array.length; i++) {
      const binary = this.array.internalTypedArray[i].toString(2)
      if (binary.length < expectedBinaryStringLength) {
        result.push('0'.repeat(expectedBinaryStringLength - binary.length) + binary)
      } else {
        result.push(binary)
      }
    }
    return result
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
    const index = quotient
    const mask = this.getMask(remainder)
    return { index, mask }
  }

  // 输入一定是一个小于Uint8Array.BYTES_PER_ELEMENT * 8的值, 取值范围是[0, 7]
  private getMask(value: number): number {
    return 2 ** value
  }
}
