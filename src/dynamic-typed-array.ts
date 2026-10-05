import { TypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { assert } from '@blackglory/errors'
import { computeNewCapacity } from '@utils/compute-new-capacity.js'

interface IDynamicTypedArrayOptions {
  growthFactor?: number
  initialCapacity?: number
}

export class DynamicTypedArray<T extends TypedArrayConstructor> {
  private array: TypedArrayOfConstructor<T>
  private initialCapacity: number
  readonly growthFactor: number
  #length: number = 0

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get internalTypedArray(): TypedArrayOfConstructor<T> {
    return this.array
  }

  readonly BYTES_PER_ELEMENT: number

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
    private typedArrayConstructor: T
  , {
      growthFactor = 1.5
    , initialCapacity = 0
    }: IDynamicTypedArrayOptions = {}
  ) {
    assert(growthFactor >= 1, 'growthFactory must be greater than or equal to 1')
    assert(Number.isInteger(initialCapacity), 'initialCapacity must be an integer')
    assert(initialCapacity >= 0, 'initialCapacity must be greater than or equal to 0')

    this.growthFactor = growthFactor
    this.initialCapacity = initialCapacity

    this.array = new typedArrayConstructor(initialCapacity) as TypedArrayOfConstructor<T>
    this.BYTES_PER_ELEMENT = typedArrayConstructor.BYTES_PER_ELEMENT
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

    if (index >= this.#length) {
      this.#length = index + 1
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
      const newCapacity = computeNewCapacity(
        this.capacity
      , newLength
      , this.growthFactor
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

      const newCapacity = computeNewCapacity(
        this.capacity
      , this.length
      , this.growthFactor
      )
      this.resize(newCapacity)

      return value
    } else {
      return undefined
    }
  }

  clear(resetCapacity: boolean = false): void {
    this.#length = 0

    if (resetCapacity && this.capacity !== this.initialCapacity) {
      const newArray = new this.typedArrayConstructor(
        resetCapacity
      ? this.initialCapacity
      : this.capacity
      )

      this.array = newArray as TypedArrayOfConstructor<T>
    } else {
      this.array.fill(0)
    }
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
      this.array = newArray as TypedArrayOfConstructor<T>
    } else if (this.array.length > newCapacity) {
      const newArray = new this.typedArrayConstructor(newCapacity)
      // 不需要的部分将被舍弃.
      for (let i = newCapacity; i--;) {
        newArray[i] = this.array[i]
      }
      this.array = newArray as TypedArrayOfConstructor<T>
    }
  }
}
