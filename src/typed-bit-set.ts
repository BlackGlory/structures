import { DynamicTypedArray } from './dynamic-typed-array'
import { UnsignedTypedArrayConstructor } from 'justypes'
import { assert } from '@blackglory/errors'
import { trailingZeros } from '@utils/trailing-zeros'

export class TypedBitSet<T extends UnsignedTypedArrayConstructor> {
  private bitsPerElement: number
  private length = 0
  private _size = 0

  constructor(private array: DynamicTypedArray<T>) {
    const bitsPerElement = array.BYTES_PER_ELEMENT * 8

    assert(
      Number.isInteger(bitsPerElement)
    , 'The parameter bitsPerElement must be an integer'
    )
    assert(
      bitsPerElement > 0
    , 'The parameter bitsPerElement must be greater than 0'
    )
    // `31`是该数据结构中能够处理的最大值
    assert(
      bitsPerElement <= 31
    , 'The mask of bitsPerElement must be less than or equal to 31'
    )

    this.bitsPerElement = bitsPerElement
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
      // maxArrayLength = Math.ceil(this.length / this.bitsPerElement)
      const maxArrayLength = ~~(this.length / this.bitsPerElement) + 1

      for (let index = 0; index < maxArrayLength; index++) {
        let element = this.array.internalTypedArray[index]
        let offset = 0
        let indexOfBit: number
        while ((indexOfBit = trailingZeros(element)) !== 32) {
          yield index * this.bitsPerElement + offset + indexOfBit
          offset += indexOfBit + 1
          element >>= indexOfBit + 1
        }
      }
    }
  }

  _dumpBinaryStrings(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.array.length; i++) {
      const binary = this.array.internalTypedArray[i].toString(2)
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

    return ((this.array.get(index) ?? 0) & mask) === mask
  }

  add(value: number): boolean {
    assert(value >= 0, 'value must be greater than or equal to 0')
    if (value >= this.length) {
      this.length = value + 1
    }

    const [index, mask] = this.getPosition(value)

    const element = this.array.get(index) ?? 0
    this.array.set(index, element | mask)

    const added = (element & mask) !== mask
    if (added) {
      this._size++
    }
    return added
  }

  delete(value: number): boolean {
    const [index, mask] = this.getPosition(value)

    const element = (this.array.get(index) ?? 0)
    this.array.set(index, element & ~mask)

    const deleted = (element & mask) === mask
    if (deleted) {
      this._size--
    }
    return deleted
  }

  clear(): void {
    for (let i = this.array.length; i--;) {
      this.array.set(i, 0)
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
    // return 2 ** value
    return 1 << value
  }
}
