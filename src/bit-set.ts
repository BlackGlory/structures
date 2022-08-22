import { DynamicTypedArray } from './dynamic-typed-array'
import { assert } from '@blackglory/errors'

export class BitSet {
  private static bitsPerElement = Uint8Array.BYTES_PER_ELEMENT * 8
  private array = new DynamicTypedArray(Uint8Array)
  private length = 0

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
    if (this.length > 0) {
      const maxArrayLength = Math.ceil(this.length / BitSet.bitsPerElement)
      const remainder = BitSet.bitsPerElement - (maxArrayLength * BitSet.bitsPerElement - this.length)
      const lastIndex = maxArrayLength - 1
      for (let index = 0; index < lastIndex; index++) {
        const element = this.array.internalTypedArray[index]
        for (let bit = 0; bit < BitSet.bitsPerElement; bit++) {
          const mask = this.getMask(bit)
          if ((element & mask) === mask) {
            yield index * BitSet.bitsPerElement + bit
          }
        }
      }
      const lastElement = this.array.internalTypedArray[maxArrayLength - 1]
      for (let bit = 0; bit < remainder; bit++) {
        const mask = this.getMask(bit)
        if ((lastElement & mask) === mask) {
          yield lastIndex * BitSet.bitsPerElement + bit
        }
      }
    }
  }

  _dumpBinaryStrings(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.array.length; i++) {
      const binary = this.array.internalTypedArray[i].toString(2)
      if (binary.length < BitSet.bitsPerElement) {
        result.push('0'.repeat(BitSet.bitsPerElement - binary.length) + binary)
      } else {
        result.push(binary)
      }
    }
    return result
  }

  has(value: number): boolean {
    const [index, mask] = this.getPosition(value)

    return ((this.array.get(index) ?? 0) & mask) === mask
  }

  add(value: number): void {
    assert(value >= 0, 'value must be greater than or equal to 0')
    if (value >= this.length) {
      this.length = value + 1
    }

    const [index, mask] = this.getPosition(value)

    this.array.set(index, (this.array.get(index) ?? 0) | mask)
  }

  delete(value: number): void {
    const [index, mask] = this.getPosition(value)

    this.array.set(index, (this.array.get(index) ?? 0) & ~mask)
  }

  clear(): void {
    for (let i = this.array.length; i--;) {
      this.array.set(i, 0)
    }
  }

  private getPosition(value: number): [index: number, mask: number] {
    const remainder = value % BitSet.bitsPerElement
    const quotient = (value - remainder) / BitSet.bitsPerElement
    const index = quotient
    const mask = this.getMask(remainder)
    return [index, mask]
  }

  // 输入一定是一个小于bitsPerElement的值, 取值范围是[0, bitsPerElement)
  private getMask(value: number): number {
    return 2 ** value
  }
}
