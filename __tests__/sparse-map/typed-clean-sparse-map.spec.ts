import { describe, test, expect } from 'vitest'
import { TypedCleanSparseMap } from '@sparse-map/typed-clean-sparse-map.js'
import { toArray } from 'iterable-operator'

describe('TypedCleanSparseMap', () => {
  describe('size', () => {
    test('empty', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))

      const result = map.size

      expect(result).toBe(0)
    })

    describe('non-empty', () => {
      test('set', () => {
        const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
        map.set(1, 10)

        const result = map.size

        expect(result).toBe(1)
      })

      test('delete', () => {
        const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
        map.set(1, 10)
        map.delete(1)

        const result = map.size

        expect(result).toBe(0)
      })
    })
  })

  test('internalKeyArray', () => {
    const keys = new Uint8Array(1000)
    const map = new TypedCleanSparseMap(keys, new Int8Array(1000))
    map.set(1, 10)

    const internalKeyArray = map.internalKeyArray
    const result = internalKeyArray[0]

    expect(internalKeyArray).toBe(keys)
    expect(result).toBe(1)
  })

  test('internalValueArray', () => {
    const values = new Int8Array(1000)
    const map = new TypedCleanSparseMap(new Uint8Array(1000), values)
    map.set(1, 10)

    const internalValueArray = map.internalValueArray
    const result = internalValueArray[0]

    expect(internalValueArray).toBe(values)
    expect(result).toBe(10)
  })

  test('has', () => {
    const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
    map.set(1, 10)

    const result1 = map.has(1)
    const result2 = map.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('set', () => {
    const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))

    map.set(1, 10)
    map.set(2, 20)

    expect(map.size).toBe(2)
    expect(map.has(0)).toBe(false)
    expect(map.has(1)).toBe(true)
    expect(map.has(2)).toBe(true)
  })

  describe('get', () => {
    test('exists', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
      map.set(1, 10)

      const result = map.get(1)

      expect(result).toBe(10)
    })

    test('does not exist', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))

      const result = map.get(1)

      expect(result).toBe(undefined)
    })

    test('edge: deleted key', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
      map.set(1, 10)
      map.delete(1)

      const result = map.get(1)

      expect(result).toBe(undefined)
    })

    test('edge: reused key', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
      map.set(1, 10)
      map.delete(1)
      map.set(1, 20)

      const result = map.get(1)

      expect(result).toBe(20)
    })

    test('edge: reused key with length growth', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
      map.set(0, 0)
      map.set(1, 10)
      map.delete(0)
      map.set(0, 20)
      map.set(2, 30)

      const result1 = map.get(0)
      const result2 = map.get(1)
      const result3 = map.get(2)

      expect(result1).toBe(20)
      expect(result2).toBe(10)
      expect(result3).toBe(30)
    })
  })

  describe('delete', () => {
    test('not last item', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
      map.set(1, 10)
      map.set(2, 20)

      map.delete(1)

      expect(map.size).toBe(1)
      expect(map.has(1)).toBe(false)
      expect(map.has(2)).toBe(true)
    })

    test('last item', () => {
      const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
      map.set(1, 10)

      map.delete(1)

      expect(map.size).toBe(0)
      expect(map.has(1)).toBe(false)
    })
  })

  test('clear', () => {
    const map = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
    map.set(1, 10)

    map.clear()

    expect(map.size).toBe(0)
    expect(map.has(1)).toBe(false)
  })

  test('entries', () => {
    const set = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
    set.set(1, 10)
    set.set(2, 20)
    set.set(3, 30)

    const iter = set.entries()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      [1, 10]
    , [2, 20]
    , [3, 30]
    ])
  })

  test('keys', () => {
    const set = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
    set.set(1, 10)
    set.set(2, 20)
    set.set(3, 30)

    const iter = set.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const set = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
    set.set(1, 10)
    set.set(2, 20)
    set.set(3, 30)

    const iter = set.values()
    const result = toArray(iter)

    expect(result).toStrictEqual([10, 20, 30])
  })

  test('getInternalIndexOfKey', () => {
    const set = new TypedCleanSparseMap(new Uint8Array(1000), new Int8Array(1000))
    set.set(3, 30)
    set.set(1, 10)
    set.set(2, 20)

    const result1 = set.getInternalIndexOfKey(1) // 1
    const result2 = set.getInternalIndexOfKey(2) // 2
    const result3 = set.getInternalIndexOfKey(3) // 0

    expect(result1).toBe(1)
    expect(result2).toBe(2)
    expect(result3).toBe(0)
    expect(set.internalValueArray[result1!]).toBe(10)
    expect(set.internalValueArray[result2!]).toBe(20)
    expect(set.internalValueArray[result3!]).toBe(30)
  })
})
