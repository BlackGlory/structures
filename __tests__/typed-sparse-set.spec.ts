import { describe, test, expect } from 'vitest'
import { TypedSparseSet } from '@src/typed-sparse-set.js'
import { DynamicTypedArray } from '@src/dynamic-typed-array.js'
import { toArray } from 'iterable-operator'

describe('TypedSparseSet', () => {
  describe('size', () => {
    test('empty', () => {
      const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))

      const result = set.size

      expect(result).toBe(0)
    })

    describe('non-empty', () => {
      test('set', () => {
        const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
        set.add(1)

        const result = set.size

        expect(result).toBe(1)
      })

      test('delete', () => {
        const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
        set.add(1)
        set.delete(1)

        const result = set.size

        expect(result).toBe(0)
      })
    })
  })

  test('has', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
    set.add(1)

    const result1 = set.has(1)
    const result2 = set.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('add', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))

    set.add(1)
    set.add(2)

    expect(set.size).toBe(2)
    expect(set.has(0)).toBe(false)
    expect(set.has(1)).toBe(true)
    expect(set.has(2)).toBe(true)
  })

  describe('delete', () => {
    test('exists', () => {
      const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
      set.add(1)

      const result = set.delete(1)

      expect(set.size).toBe(0)
      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))

      const result = set.delete(1)

      expect(set.size).toBe(0)
      expect(result).toBe(false)
    })

    test('not last item', () => {
      const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
      set.add(1)
      set.add(2)

      set.delete(1)

      expect(set.size).toBe(1)
      expect(set.has(1)).toBe(false)
      expect(set.has(2)).toBe(true)
    })

    test('last item', () => {
      const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
      set.add(1)

      set.delete(1)

      expect(set.size).toBe(0)
      expect(set.has(1)).toBe(false)
    })
  })

  test('clear', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
    set.add(1)

    set.clear()

    expect(set.size).toBe(0)
    expect(set.has(1)).toBe(false)
  })

  test('[Symbol.iterator]', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array, { capacity: 100 }))
    set.add(1)
    set.add(2)
    set.add(3)

    const result = toArray(set)

    expect(result).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array, { capacity: 100 }))
    set.add(1)
    set.add(2)
    set.add(3)

    const iter = set.values()
    const result = toArray(iter)

    expect(result).toStrictEqual([1, 2, 3])
  })
})
