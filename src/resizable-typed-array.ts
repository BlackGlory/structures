import { TypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { assert } from '@blackglory/errors'
import { computeNewCapacity } from '@utils/compute-new-capacity.js'

interface IResizableTypedArrayOptions {
  maxCapacity: number

  initialCapacity?: number
  growthFactor?: number

  fillValue?: number
}

export class ResizableTypedArray<
  T extends TypedArrayConstructor
> implements Iterable<number> {
  private array: TypedArrayOfConstructor<T, ArrayBuffer>

  readonly maxCapacity: number
  readonly growthFactor: number
  readonly BYTES_PER_ELEMENT: number
  readonly internalTypedArray: TypedArrayOfConstructor<T>
  readonly fillValue: number

  private _length: number = 0

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  /**
   * 数组当前的容量.
   */
  get capacity(): number {
    return this.array.length
  }

  /**
   * 数组逻辑上的长度, 总是小于或等于capacity.
   */
  get length(): number {
    return this._length
  }

  constructor(
    typedArrayConstructor: T
  , {
      maxCapacity
    , initialCapacity = 0
    , growthFactor = 1.5
    , fillValue = 0
    }: IResizableTypedArrayOptions
  ) {
    assert(growthFactor >= 1, 'growthFactory must be greater than or equal to 1')
    assert(initialCapacity >= 0, 'initialCapacity must be greater than or equal to 0')
    assert(Number.isInteger(initialCapacity), 'capacity must be an integer')
    assert(initialCapacity >= 0, 'capacity must be greater than or equal to 0')
    assert(Number.isInteger(maxCapacity), 'maxCapacity must be an integer')
    assert(maxCapacity >= initialCapacity, 'maxCapacity must be greater than or equal to capacity')

    this.growthFactor = growthFactor
    this.maxCapacity = maxCapacity
    this.fillValue = fillValue

    const buffer = new ArrayBuffer(
      initialCapacity * typedArrayConstructor.BYTES_PER_ELEMENT
    , { maxByteLength: maxCapacity * typedArrayConstructor.BYTES_PER_ELEMENT }
    )
    const array = new typedArrayConstructor(buffer)
    if (fillValue !== 0) array.fill(fillValue)
    this.array = array as TypedArrayOfConstructor<T, ArrayBuffer>

    this.internalTypedArray = array as TypedArrayOfConstructor<T, ArrayBuffer>
    this.BYTES_PER_ELEMENT = typedArrayConstructor.BYTES_PER_ELEMENT
  }

  [Symbol.iterator](): IterableIterator<number> {
    return this.values()
  }

  * values(): IterableIterator<number> {
    for (let i = 0; i < this._length; i++) {
      yield this.array[i]
    }
  }

  set(index: number, value: number): void {
    if (index >= this.capacity) {
      assert(index < this.maxCapacity, 'index must be less than maxCapacity')

      const newCapacity = Math.min(
        computeNewCapacity(
          this.capacity
        , index + 1
        , this.growthFactor
        )
      , this.maxCapacity
      )

      this.resize(newCapacity)
    }

    if (index >= this._length) {
      this._length = index + 1
    }

    this.array[index] = value
  }

  setValues(index: number, values: ArrayLike<number>): void {
    const endIndex = index + values.length
    if (endIndex > this.capacity) {
      assert(
        endIndex <= this.maxCapacity
      , 'endIndex must be less than or equal tomaxCapacity'
      )

      const newCapacity = Math.min(
        computeNewCapacity(
          this.capacity
        , index + values.length
        , this.growthFactor
        )
      , this.maxCapacity
      )

      this.resize(newCapacity)
    }

    if (endIndex > this._length) {
      this._length = endIndex
    }

    this.array.set(values, index)
  }

  get(index: number): number | undefined {
    return index < this._length
         ? this.array[index]
         : undefined
  }

  push(...values: number[]): void {
    const newLength = this._length + values.length
    if (newLength > this.capacity) {
      assert(
        newLength <= this.maxCapacity
      , 'newLength must be less than or equal to maxCapacity'
      )

      const newCapacity = Math.min(
        computeNewCapacity(
          this.capacity
        , newLength
        , this.growthFactor
        )
      , this.maxCapacity
      )

      this.resize(newCapacity)
    }

    for (const value of values) {
      this.array[this._length++] = value
    }
  }

  pop(): number | undefined {
    if (this._length > 0) {
      const value = this.array[this._length - 1]
      this._length--

      return value
    } else {
      return undefined
    }
  }

  clear(): void {
    this._length = 0
  }

  shrink(): void {
    const newCapacity = computeNewCapacity(
      this.capacity
    , this.length
    , this.growthFactor
    )
    this.resize(newCapacity)
  }

  sort(compare?: (a: number, b: number) => number): void {
    const capacity = this.capacity
    this.resize(this.length)
    this.array.sort(compare)
    this.resize(capacity)
  }

  private resize(newCapacity: number): void {
    if (this.array.length === newCapacity) {
      return
    } else if (this.array.length < newCapacity) {
      if (this.fillValue === 0) {
        this.array.buffer.resize(newCapacity * this.BYTES_PER_ELEMENT)
      } else {
        const startIndex = this.array.length
        this.array.buffer.resize(newCapacity * this.BYTES_PER_ELEMENT)
        this.array.fill(this.fillValue, startIndex)
      }
    } else /* if (this.array.length > newCapacity) */ {
      this.array.buffer.resize(newCapacity * this.BYTES_PER_ELEMENT)
    }
  }
}
