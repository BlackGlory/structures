import { describe, test, expect } from 'vitest'
import { CleanSparseMap } from '@sparse-map/clean-sparse-map.js'
import { toArray } from 'iterable-operator'

describe('SparseMap', () => {
  describe('size', () => {
    test('empty', () => {
      const map = new CleanSparseMap()

      const result = map.size

      expect(result).toBe(0)
    })

    describe('non-empty', () => {
      test('set', () => {
        const map = new CleanSparseMap()
        map.set(1, '1')

        const result = map.size

        expect(result).toBe(1)
      })

      test('delete', () => {
        const map = new CleanSparseMap()
        map.set(1, '1')
        map.delete(1)

        const result = map.size

        expect(result).toBe(0)
      })
    })
  })

  test('internalKeyArray', () => {
    const map = new CleanSparseMap()
    map.set(1, 10)

    const result = map.internalKeyArray[0]

    expect(result).toBe(1)
  })

  test('internalValueArray', () => {
    const map = new CleanSparseMap()
    map.set(1, 10)

    const result = map.internalValueArray[0]

    expect(result).toBe(10)
  })

  test('has', () => {
    const map = new CleanSparseMap()
    map.set(1, '1')

    const result1 = map.has(1)
    const result2 = map.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  describe('get', () => {
    test('exists', () => {
      const map = new CleanSparseMap()
      map.set(1, '1')

      const result = map.get(1)

      expect(result).toBe('1')
    })

    test('does not exist', () => {
      const map = new CleanSparseMap()

      const result = map.get(1)

      expect(result).toBe(undefined)
    })

    test('edge: deleted key', () => {
      const map = new CleanSparseMap()
      map.set(1, '1')
      map.delete(1)

      const result = map.get(1)

      expect(result).toBe(undefined)
    })

    test('edge: reused key', () => {
      const map = new CleanSparseMap()
      map.set(1, '1')
      map.delete(1)
      map.set(1, '2')

      const result = map.get(1)

      expect(result).toBe('2')
    })

    test('edge: reused key with length growth', () => {
      const map = new CleanSparseMap()
      map.set(0, '0')
      map.set(1, '1')
      map.delete(0)
      map.set(0, '2')
      map.set(2, '3')

      const result1 = map.get(0)
      const result2 = map.get(1)
      const result3 = map.get(2)

      expect(result1).toBe('2')
      expect(result2).toBe('1')
      expect(result3).toBe('3')
    })
  })

  test('set', () => {
    const map = new CleanSparseMap()

    map.set(1, '1')
    map.set(2, '2')

    expect(map.has(0)).toBe(false)
    expect(map.has(1)).toBe(true)
    expect(map.has(2)).toBe(true)
  })

  describe('delete', () => {
    describe('item exists', () => {
      test('not last item', () => {
        const map = new CleanSparseMap()
        map.set(1, '1')
        map.set(2, '2')

        const result = map.delete(1)

        expect(result).toBe(true)
        expect(map.has(1)).toBe(false)
        expect(map.has(2)).toBe(true)
      })

      test('last item', () => {
        const set = new CleanSparseMap()
        set.set(1, '1')

        const result = set.delete(1)

        expect(result).toBe(true)
        expect(set.has(1)).toBe(false)
      })
    })

    test('item does not exist', () => {
      const set = new CleanSparseMap()

      const result = set.delete(1)

      expect(result).toBe(false)
    })
  })

  test('clear', () => {
    const map = new CleanSparseMap()
    map.set(1, '1')

    map.clear()

    expect(map.has(1)).toBe(false)
  })

  test('entries', () => {
    const set = new CleanSparseMap()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const iter = set.entries()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      [1, '1']
    , [2, '2']
    , [3, '3']
    ])
  })

  test('keys', () => {
    const set = new CleanSparseMap()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const iter = set.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const set = new CleanSparseMap()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const iter = set.values()
    const result = toArray(iter)

    expect(result).toStrictEqual(['1', '2', '3'])
  })

  test('getInternalIndexOfKey', () => {
    const set = new CleanSparseMap()
    set.set(3, 30)
    set.set(1, 10)
    set.set(2, 20)

    const result1 = set.getInternalIndexOfKey(1) // 1
    const result2 = set.getInternalIndexOfKey(2) // 2
    const result3 = set.getInternalIndexOfKey(3) // 0

    expect(result1).toBe(1)
    expect(result2).toBe(2)
    expect(result3).toBe(0)
    expect(set.internalKeyArray[result1!]).toBe(1)
    expect(set.internalValueArray[result1!]).toBe(10)
    expect(set.internalKeyArray[result2!]).toBe(2)
    expect(set.internalValueArray[result2!]).toBe(20)
    expect(set.internalKeyArray[result3!]).toBe(3)
    expect(set.internalValueArray[result3!]).toBe(30)
  })
})
