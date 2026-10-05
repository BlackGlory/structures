import { UnsignedTypedArrayConstructor } from 'justypes'
import { assert } from '@blackglory/errors'
import { ResizableTypedArray } from '@src/resizable-typed-array.js'
import { trailingZeros } from '@utils/trailing-zeros.js'

export class ResizableTypedBitSet<
  T extends UnsignedTypedArrayConstructor
> implements Iterable<number> {
  private bitsPerElement: number
  private length = 0
  #size = 0

  private quotientShift = 0
  private remainderMask = 0

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.#size
  }

  constructor(private array: ResizableTypedArray<T>) {
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
      bitsPerElement <= 32
    , 'The bitsPerElement must be less than or equal to 31'
    )

    this.bitsPerElement = bitsPerElement
    this.quotientShift = Math.log2(bitsPerElement)
    this.remainderMask = bitsPerElement - 1
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    if (this.length > 0) {
      // maxArrayLength = Math.ceil(this.length / this.bitsPerElement)
      const maxArrayLength = ~~(this.length / this.bitsPerElement) + 1

      for (let index = 0; index < maxArrayLength; index++) {
        let element = this.array.get(index) ?? 0
        while (element !== 0) {
          const indexOfBit = trailingZeros(element)
          yield index * this.bitsPerElement + indexOfBit
          // 移除最低位置的1, 以推进下一个indexOfBit的获取.
          element &= element - 1
        }
      }
    }
  }

  _dumpBinaryStrings(): string[] {
    const result: string[] = []
    for (let i = 0; i < this.array.length; i++) {
      const binary = ((this.array.get(i) ?? 0) >>> 0).toString(2)
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
    const [index, mask] = this.getPosition(value)

    const element = this.array.get(index) ?? 0
    this.array.set(index, element | mask)

    const added = (element & mask) !== mask
    if (added) this.#size++

    if (value >= this.length) this.length = value + 1

    return added
  }

  delete(value: number): boolean {
    const [index, mask] = this.getPosition(value)

    const element = (this.array.get(index) ?? 0)
    this.array.set(index, element & ~mask)

    const deleted = (element & mask) === mask
    if (deleted) this.#size--

    return deleted
  }

  clear(): void {
    this.#size = 0
    this.length = 0
    this.array.clear()
  }

  private getPosition(value: number): [index: number, mask: number] {
    const remainder = value & this.remainderMask
    const quotient = value >>> this.quotientShift

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
