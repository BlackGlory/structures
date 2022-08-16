import { DynamicTypedArray, computeNewCapacity } from '@src/dynamic-typed-array'

describe('DynamicTypedArray', () => {
  test('new', () => {
    const arr = new DynamicTypedArray(Int8Array, {
      capacity: 1
    , growthFactor: 2
    })

    expect(arr.capacity).toBe(1)
    expect(arr.length).toBe(0)
  })

  describe('set', () => {
    test('index < capacity', () => {
      const arr = new DynamicTypedArray(Int8Array, {
        capacity: 1
      , growthFactor: 2
      })

      arr.set(0, 1)

      expect(arr.get(0)).toBe(1)
      expect(arr.capacity).toBe(1)
      expect(arr.length).toBe(1)
    })

    describe('index >= capacity', () => {
      it('resizes', () => {
        const arr = new DynamicTypedArray(Int8Array, {
          capacity: 1
        , growthFactor: 2
        })

        arr.set(1, 1)

        expect(arr.get(1)).toBe(1)
        expect(arr.capacity).toBe(2)
        expect(arr.length).toBe(2)
      })
    })
  })

  describe('get', () => {
    test('index < length', () => {
      const arr = new DynamicTypedArray(Int8Array, {
        capacity: 2
      , growthFactor: 2
      })
      arr.set(1, 1)

      const result = arr.get(0)

      expect(result).toBe(0)
      expect(arr.length).toBe(2)
    })

    test('index >= length', () => {
      const arr = new DynamicTypedArray(Int8Array, {
        capacity: 1
      , growthFactor: 2
      })

      const result = arr.get(0)

      expect(result).toBe(undefined)
      expect(arr.length).toBe(0)
    })
  })

  describe('push', () => {
    test('newLength <= capacity', () => {
      const arr = new DynamicTypedArray(Int8Array, {
        capacity: 3
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
      it('resizes', () => {
        const arr = new DynamicTypedArray(Int8Array, {
          capacity: 2
        , growthFactor: 2
        })
        arr.set(0, 1)

        arr.push(2, 3) // arr[1] = 2, arr[2] = 3

        expect(arr.get(1)).toBe(2)
        expect(arr.get(2)).toBe(3)
        expect(arr.capacity).toBe(4)
        expect(arr.length).toBe(3)
      })
    })
  })

  describe('pop', () => {
    test('empty array', () => {
      const arr = new DynamicTypedArray(Int8Array, {
        capacity: 1
      , growthFactor: 2
      })

      const result = arr.pop()

      expect(result).toBe(undefined)
      expect(arr.length).toBe(0)
      expect(arr.capacity).toBe(1)
    })

    describe('non-empty array', () => {
      describe('length < capacity / growthFactor', () => {
        it('resizes', () => {
          const arr = new DynamicTypedArray(Int8Array, {
            capacity: 1
          , growthFactor: 2
          })
          arr.push(1)

          const result = arr.pop()

          expect(result).toBe(1)
          expect(arr.length).toBe(0)
          expect(arr.capacity).toBe(0)
        })
      })

      test('length > capacity / growthFactor', () => {
        const arr = new DynamicTypedArray(Int8Array, {
          capacity: 2
        , growthFactor: 4
        })
        arr.push(1)
        arr.push(2)

        const result = arr.pop()

        expect(result).toBe(2)
        expect(arr.length).toBe(1)
        expect(arr.capacity).toBe(2)
      })
    })
  })
})

describe('computeNewCapacity', () => {
  test('oldCapacity = targetLength', () => {
    const oldCapacity = 30
    const targetLength = 30
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(30)
  })

  test('oldCapactiy < targetLength', () => {
    const oldCapacity = 10
    const targetLength = 30
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(40)
  })

  describe('oldCapactiy > targetLength', () => {
    test('oldCapactiy / growthFactory > targetLength', () => {
      const oldCapacity = 80
      const targetLength = 30
      const growthFactory = 2

      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(40)
    })

    test('oldCapactiy / growthFactory < targetLength', () => {
      const oldCapacity = 50
      const targetLength = 30
      const growthFactory = 2

      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(50)
    })
  })

  test('edge: oldCapacity = 0', () => {
    const oldCapacity = 0
    const targetLength = 30
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(32)
  })

  test('edge: targetLength = 0', () => {
    const oldCapacity = 10
    const targetLength = 0
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(0)
  })

  describe('edge: growthFactory is a floating point number', () => {
    test('oldCapacity < targetLength', () => {
      const oldCapacity = 9
      const targetLength = 30
      const growthFactory = 1.5

      // 9 * 1.5 * 1.5 * 1.5 = 30.375
      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(30)
    })

    test('oldCapacity > targetLength', () => {
      const oldCapacity = 68
      const targetLength = 30
      const growthFactory = 1.5

      // 68 / 1.5 / 1.5 = 30.222222
      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(30)
    })
  })
})