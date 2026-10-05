import { describe, test, expect } from 'vitest'
import { ResizableTypedArray } from '@src/resizable-typed-array.js'
import { getError } from 'return-style'

describe('ResizableTypedArray', () => {
  test('constructor', () => {
    const arr = new ResizableTypedArray(Int8Array, {
      maxCapacity: 1000
    , initialCapacity: 1
    , growthFactor: 2
    })

    expect(arr.capacity).toBe(1)
    expect(arr.length).toBe(0)
  })

  test('internalTypedArray', () => {
    const arr = new ResizableTypedArray(Int8Array, {
      maxCapacity: 1000
    , initialCapacity: 1
    , growthFactor: 2
    })
    arr.set(0, 0)

    const internalArr = arr.internalTypedArray
    internalArr[0] = 1
    const result1 = arr.get(0)
    arr.set(0, 2)
    const result2 = internalArr[0]

    expect(internalArr).toBeInstanceOf(Int8Array)
    expect(result1).toBe(1)
    expect(result2).toBe(2)
  })

  describe('set', () => {
    test('index < capacity', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 1
      , growthFactor: 2
      })

      arr.set(0, 1)

      expect(arr.get(0)).toBe(1)
      expect(arr.capacity).toBe(1)
      expect(arr.length).toBe(1)
    })

    describe('index >= capacity', () => {
      test('resizing successful', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1000
        , initialCapacity: 1
        , growthFactor: 2
        })

        arr.set(1, 1)

        expect(arr.get(1)).toBe(1)
        expect(arr.capacity).toBe(2)
        expect(arr.length).toBe(2)
      })

      test('resizing failed', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1
        , initialCapacity: 1
        , growthFactor: 2
        })

        const error = getError(() => arr.set(1, 1))

        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('setValues', () => {
    test('index + values.length <= capacity', () => {
      const arr = new ResizableTypedArray(Int16Array, {
        maxCapacity: 1000
      , initialCapacity: 1
      , growthFactor: 2
      })
      const values = new Int16Array(1)
      values[0] = 1
      const index = 0

      arr.setValues(index, values)

      expect(arr.get(0)).toBe(1)
      expect(arr.capacity).toBe(1)
      expect(arr.length).toBe(1)
    })

    describe('index + values.length > capacity', () => {
      test('resizing successful', () => {
        const arr = new ResizableTypedArray(Int16Array, {
          maxCapacity: 1000
        , initialCapacity: 1
        , growthFactor: 2
        })
        const values = new Int16Array(2)
        values[0] = 1
        values[1] = 2
        const index = 1

        arr.setValues(index, values)

        expect(arr.get(0)).toBe(0)
        expect(arr.get(1)).toBe(1)
        expect(arr.get(2)).toBe(2)
        expect(arr.capacity).toBe(4)
        expect(arr.length).toBe(3)
      })

      test('resizing failed', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1
        , initialCapacity: 1
        , growthFactor: 2
        })

        const error = getError(() => arr.setValues(1, [1]))

        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('get', () => {
    test('index < length', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 2
      , growthFactor: 2
      })
      arr.set(1, 1)

      const result = arr.get(0)

      expect(result).toBe(0)
      expect(arr.length).toBe(2)
    })

    test('index >= length', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 1
      , growthFactor: 2
      })

      const result = arr.get(0)

      expect(result).toBeUndefined()
      expect(arr.length).toBe(0)
    })
  })

  describe('push', () => {
    test('newLength <= capacity', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 3
      , growthFactor: 2
      })
      arr.set(0, 1)

      arr.push(2, 3) // arr[1] = 2, arr[2] = 3

      expect(arr.get(1)).toBe(2)
      expect(arr.get(2)).toBe(3)
      expect(arr.capacity).toBe(3)
      expect(arr.length).toBe(3)
    })

    describe('newLength > capacity', () => {
      test('resizing successful', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1000
        , initialCapacity: 2
        , growthFactor: 2
        })
        arr.set(0, 1)

        arr.push(2, 3) // arr[1] = 2, arr[2] = 3

        expect(arr.get(1)).toBe(2)
        expect(arr.get(2)).toBe(3)
        expect(arr.capacity).toBe(4)
        expect(arr.length).toBe(3)
      })

      test('resizing failed', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1
        , initialCapacity: 1
        , growthFactor: 2
        })
        arr.set(0, 1)

        const error = getError(() => arr.push(2))

        expect(error).toBeInstanceOf(Error)
      })
    })
  })

  describe('pop', () => {
    test('empty array', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 1
      , growthFactor: 2
      })

      const result = arr.pop()

      expect(result).toBe(undefined)
      expect(arr.length).toBe(0)
      expect(arr.capacity).toBe(1)
    })

    test('non-empty array', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 1
      , growthFactor: 2
      })
      arr.push(1)

      const result = arr.pop()

      expect(result).toBe(1)
      expect(arr.length).toBe(0)
      expect(arr.capacity).toBe(1)
    })
  })

  test('clear', () => {
    const arr = new ResizableTypedArray(Int8Array, {
      maxCapacity: 1000
    , initialCapacity: 1
    , growthFactor: 2
    })
    arr.push(1, 2)

    arr.clear()

    expect(arr.length).toBe(0)
    expect(arr.capacity).toBe(2)
  })

  describe('shrink', () => {
    test('empty array', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 1
      , growthFactor: 2
      })

      arr.shrink()

      expect(arr.length).toBe(0)
      expect(arr.capacity).toBe(0)
    })

    describe('non-empty array', () => {
      test('shrink', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1000
        , initialCapacity: 1
        , growthFactor: 2
        })
        arr.push(1, 2, 3)
        arr.pop()

        arr.shrink()

        expect(arr.length).toBe(2)
        expect(arr.capacity).toBe(2)
      })

      test('does not shrink', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1000
        , initialCapacity: 1
        , growthFactor: 2
        })
        arr.push(1, 2, 3)

        arr.shrink()

        expect(arr.length).toBe(3)
        expect(arr.capacity).toBe(4)
      })
    })
  })

  describe('sort', () => {
    test('empty array', () => {
      const arr = new ResizableTypedArray(Int8Array, {
        maxCapacity: 1000
      , initialCapacity: 1
      , growthFactor: 2
      })

      arr.sort()

      expect(arr.length).toBe(0)
      expect(arr.capacity).toBe(1)
    })

    describe('non-empty array', () => {
      test('without compare', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1000
        , initialCapacity: 1
        , growthFactor: 2
        })
        arr.push(10, 3, 2)

        arr.sort()

        expect(arr.length).toBe(3)
        expect(arr.capacity).toBe(4)
        expect(arr.get(0)).toBe(2)
        expect(arr.get(1)).toBe(3)
        expect(arr.get(2)).toBe(10)
      })

      test('with compare', () => {
        const arr = new ResizableTypedArray(Int8Array, {
          maxCapacity: 1000
        , initialCapacity: 1
        , growthFactor: 2
        })
        arr.push(2, 3, 10)

        arr.sort((a, b) => b - a)

        expect(arr.length).toBe(3)
        expect(arr.capacity).toBe(4)
        expect(arr.get(0)).toBe(10)
        expect(arr.get(1)).toBe(3)
        expect(arr.get(2)).toBe(2)
      })
    })
  })
})
