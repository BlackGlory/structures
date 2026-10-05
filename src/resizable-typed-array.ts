import { TypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { assert } from '@blackglory/errors'
import { computeNewCapacity } from '@utils/compute-new-capacity.js'

interface IResizableTypedArrayOptions {
  maxCapacity: number

  initialCapacity?: number
  growthFactor?: number
}

export class ResizableTypedArray<T extends TypedArrayConstructor> {
  private array: TypedArrayOfConstructor<T, ArrayBuffer>

  readonly maxCapacity: number
  readonly growthFactor: number
  readonly BYTES_PER_ELEMENT: number
  readonly internalTypedArray: TypedArrayOfConstructor<T>

  #length: number = 0

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
    return this.#length
  }

  constructor(
    typedArrayConstructor: T
  , {
      maxCapacity
    , initialCapacity = 0
    , growthFactor = 1.5
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

    const buffer = new ArrayBuffer(
      initialCapacity * typedArrayConstructor.BYTES_PER_ELEMENT
    , { maxByteLength: maxCapacity * typedArrayConstructor.BYTES_PER_ELEMENT }
    )
    this.array = new typedArrayConstructor(buffer) as TypedArrayOfConstructor<T, ArrayBuffer>

    this.internalTypedArray = this.array
    this.BYTES_PER_ELEMENT = typedArrayConstructor.BYTES_PER_ELEMENT
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

    if (index >= this.#length) {
      this.#length = index + 1
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

    if (endIndex > this.#length) {
      this.#length = endIndex
    }

    this.array.set(values, index)
  }

  get(index: number): number | undefined {
    return index < this.#length
         ? this.array[index]
         : undefined
  }

  push(...values: number[]): void {
    const newLength = this.#length + values.length
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
      this.array[this.#length++] = value
    }
  }

  pop(): number | undefined {
    if (this.#length > 0) {
      const value = this.array[this.#length - 1]
      this.#length--

      return value
    } else {
      return undefined
    }
  }

  clear(): void {
    this.#length = 0
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
    if (this.array.length !== newCapacity) {
      this.array.buffer.resize(newCapacity * this.BYTES_PER_ELEMENT)
    }
  }
}
