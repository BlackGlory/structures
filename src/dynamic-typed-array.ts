import { TypedArrayConstructor, TypedArrayOfConstructor } from 'justypes'
import { assert } from '@blackglory/errors'

interface IDynamicTypedArrayOptions {
  capacity?: number
  growthFactor?: number
}

// 相关提案: https://github.com/tc39/proposal-resizablearraybuffer
export class DynamicTypedArray<T extends TypedArrayConstructor> {
  private array: TypedArrayOfConstructor<T>
  private _length: number = 0
  private growthFactor: number

  get internalTypedArray(): TypedArrayOfConstructor<T> {
    return this.array
  }

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
    private typedArrayConstructor: T
  , {
      capacity = 0
    , growthFactor = 1.5
    }: IDynamicTypedArrayOptions = {}
  ) {
    assert(Number.isInteger(capacity), 'capacity must be an integer')
    assert(capacity >= 0, 'capacity must be greater than or equal to 0')
    assert(growthFactor > 1, 'growthFactory must be greater than or equal to 1')

    this.array = new typedArrayConstructor(capacity) as TypedArrayOfConstructor<T>
    this.growthFactor = growthFactor
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

export function computeNewCapacity(
  oldCapacity: number
, targetLength: number
, growthFactor: number
): number {
  if (oldCapacity === targetLength) {
    return targetLength
  } else if (oldCapacity < targetLength) { 
    // 增加容量以适配targetLength
    let newCapacity = Math.max(oldCapacity, 1)
    while (newCapacity < targetLength) {
      newCapacity *= growthFactor
    }
    return Math.floor(newCapacity)
  } else {
    // 尝试减少容量以适配targetLength

    // `targetLength = 0`是特殊情况,
    // 此时无论怎么将oldCapacity除以growthFactory几次, 都不可能得到比targetLength小的结果.
    if (targetLength === 0) {
      return 0
    } else {
      let newCapacity = oldCapacity
      while (true) {
        const temp = newCapacity / growthFactor
        if (temp < targetLength) {
          break
        } else {
          newCapacity = temp
        }
      }
      return Math.floor(newCapacity)
    }
  }
}
