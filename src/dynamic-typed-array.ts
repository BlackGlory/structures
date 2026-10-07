import { TypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { assert } from '@blackglory/errors'
import { computeNewCapacity } from '@utils/compute-new-capacity.js'

interface IDynamicTypedArrayOptions {
  growthFactor?: number
  initialCapacity?: number
  fillValue?: number
}

export class DynamicTypedArray<
  T extends TypedArrayConstructor
> implements Iterable<number> {
  private array: TypedArrayOfConstructor<T>

  readonly growthFactor: number
  readonly BYTES_PER_ELEMENT: number
  readonly fillValue: number

  private _length: number = 0

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get internalTypedArray(): TypedArrayOfConstructor<T> {
    return this.array
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
    private typedArrayConstructor: T
  , {
      growthFactor = 1.5
    , initialCapacity = 0
    , fillValue = 0
    }: IDynamicTypedArrayOptions = {}
  ) {
    assert(growthFactor >= 1, 'growthFactory must be greater than or equal to 1')
    assert(Number.isInteger(initialCapacity), 'initialCapacity must be an integer')
    assert(initialCapacity >= 0, 'initialCapacity must be greater than or equal to 0')

    this.growthFactor = growthFactor
    this.fillValue = fillValue

    const array = new typedArrayConstructor(initialCapacity) as TypedArrayOfConstructor<T>
    if (fillValue !== 0) array.fill(fillValue)
    this.array = array

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
      const newCapacity = computeNewCapacity(
        this.capacity
      , index + 1
      , this.growthFactor
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
      const newCapacity = computeNewCapacity(
        this.capacity
      , endIndex
      , this.growthFactor
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
      const newCapacity = computeNewCapacity(
        this.capacity
      , newLength
      , this.growthFactor
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
      const newArray = new this.typedArrayConstructor(newCapacity)
      newArray.set(this.array)

      if (this.fillValue !== 0) {
        const startIndex = this.array.length
        newArray.fill(this.fillValue, startIndex)
      }

      this.array = newArray as TypedArrayOfConstructor<T>
    } else /* if (this.array.length > newCapacity) */ {
      const newArray = new this.typedArrayConstructor(newCapacity)
      // 不需要的部分将被舍弃.
      for (let i = newCapacity; i--;) {
        newArray[i] = this.array[i]
      }
      this.array = newArray as TypedArrayOfConstructor<T>
    }
  }
}
