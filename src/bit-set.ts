import { assert } from '@blackglory/errors'

export class BitSet {
  private array: number[] = []
  private length = 0
  private _size = 0

  constructor(private bitsPerElement: number = 32) {
    assert(
      Number.isInteger(bitsPerElement)
    , 'The parameter bitsPerElement must be an integer'
    )
    assert(
      bitsPerElement > 0
    , 'The parameter bitsPerElement must be greater than 0'
    )
    // `32`是该数据结构中能够处理的最大值
    assert(
      bitsPerElement <= 32
    , 'The mask of bitsPerElement must be less than or equal to 32'
    )
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this._size
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    if (this.length > 0) {
      const maxArrayLength = Math.ceil(this.length / this.bitsPerElement)
      const remainder =
        this.bitsPerElement
      - (maxArrayLength * this.bitsPerElement - this.length)

      const lastIndex = maxArrayLength - 1
      for (let index = 0; index < lastIndex; index++) {
        let element = this.array[index]
        for (let bit = 0; bit < this.bitsPerElement; bit++) {
          if (element & 1) {
            yield index * this.bitsPerElement + bit
          }
          element >>= 1
        }
      }

      let lastElement = this.array[maxArrayLength - 1]
      for (let bit = 0; bit < remainder; bit++) {
        if (lastElement & 1) {
          yield lastIndex * this.bitsPerElement + bit
        }
        lastElement >>= 1
      }
    }
  }

  _dumpBinaryStrings(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.array.length; i++) {
      const binary = this.array[i].toString(2)
      if (binary.length < this.bitsPerElement) {
        result.push('0'.repeat(this.bitsPerElement - binary.length) + binary)
      } else {
        result.push(binary)
      }
    }
    return result
  }

  has(value: number): boolean {
    const [index, mask] = this.getPosition(value)

    return ((this.array[index] ?? 0) & mask) === mask
  }

  add(value: number): void {
    assert(value >= 0, 'value must be greater than or equal to 0')
    if (value >= this.length) {
      this.length = value + 1
    }

    const [index, mask] = this.getPosition(value)

    const element = this.array[index] ?? 0
    this.array[index] = element | mask

    const added = (element & mask) !== mask
    if (added) {
      this._size++
    }
  }

  delete(value: number): boolean {
    const [index, mask] = this.getPosition(value)

    const element = (this.array[index] ?? 0)
    this.array[index] = element & ~mask

    const deleted = (element & mask) === mask
    if (deleted) {
      this._size--
    }

    return deleted
  }

  clear(): void {
    for (let i = this.array.length; i--;) {
      this.array[i] = 0
    }
  }

  private getPosition(value: number): [index: number, mask: number] {
    const remainder = value % this.bitsPerElement
    const quotient = (value - remainder) / this.bitsPerElement
    const index = quotient
    const mask = this.getMask(remainder)
    return [index, mask]
  }

  // 输入一定是一个小于bitsPerElement的值, 取值范围是[0, bitsPerElement)
  private getMask(value: number): number {
    return 1 << value
  }
}
