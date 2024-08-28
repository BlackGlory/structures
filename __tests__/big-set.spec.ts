import { describe, test, expect } from 'vitest'
import { BigSet } from '@src/big-set.js'
import { toArray } from 'iterable-operator'

describe('BigSet', () => {
  test('[Symbol.toStringTag]', () => {
    const set = new BigSet()

    const result = set[Symbol.toStringTag]

    expect(result).toBe('BigSet')
  })

  describe('size', () => {
    test('empty', () => {
      const set = new BigSet()

      const result = set.size

      expect(result).toBe(0)
    })

    test('non-empty', () => {
      const set = new BigSet()
      set._sets = [new Set([1, 2]), new Set([3])]

      const result = set.size

      expect(result).toBe(3)
    })
  })

  test('[Symbol.iterator]', () => {
    const set = new BigSet()
    set._sets = [new Set([1, 2]), new Set([3])]

    const result = toArray(set)

    expect(result).toStrictEqual([1, 2, 3])
  })

  describe('add', () => {
    test('exists', () => {
      const set = new BigSet()
      set._sets = [new Set([1]), new Set([2])]

      set.add(2)

      expect(set._sets).toStrictEqual([
        new Set([1])
      , new Set([2])
      ])
    })

    describe('does not exist', () => {
      test('normal', () => {
        const set = new BigSet()
        set._sets = [new Set([1]), new Set([2])]

        set.add(3)

        expect(set._sets).toStrictEqual([
          new Set([1, 3])
        , new Set([2])
        ])
      })

      test('edge: empty', () => {
        const set = new BigSet()

        set.add(1)

        expect(set._sets).toStrictEqual([
          new Set([1])
        ])
      })

      test('edge: throws RangeError', () => {
        class RangeErrorSet<T> extends Set<T> implements Set<T> {
          add(): this {
            throw new RangeError('out of range')
          }
        }
        const set = new BigSet()
        set._sets = [new RangeErrorSet()]

        set.add(1)

        expect(set._sets).toStrictEqual([
          new RangeErrorSet()
        , new Set([1])
        ])
      })
    })
  })

  describe('has', () => {
    test('exists', () => {
      const set = new BigSet()
      set._sets = [new Set([1]), new Set([2])]

      const result = set.has(2)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const set = new BigSet()
      set._sets = [new Set([1]), new Set([2])]

      const result = set.has(3)

      expect(result).toBe(false)
    })
  })

  describe('delete', () => {
    describe('exists', () => {
      test('normal', () => {
        const set = new BigSet()
        set._sets = [new Set([1, 2]), new Set([3])]

        const result = set.delete(2)

        expect(result).toBe(true)
        expect(set._sets).toStrictEqual([
          new Set([1])
        , new Set([3])
        ])
      })

      test('edge: last element of the sub set', () => {
        const set = new BigSet()
        set._sets = [new Set([1]), new Set([2]), new Set([3])]

        const result = set.delete(2)

        expect(result).toBe(true)
        expect(set._sets).toStrictEqual([
          new Set([1])
        , new Set([3])
        ])
      })
    })

    test('does not exist', () => {
      const set = new BigSet()
      set._sets = [new Set([1]), new Set([2])]

      const result = set.delete(3)

      expect(result).toBe(false)
      expect(set._sets).toStrictEqual([
        new Set([1])
      , new Set([2])
      ])
    })
  })

  test('clear', () => {
    const set = new BigSet()
    set._sets = [new Set([1]), new Set([2])]

    set.clear()

    expect(set._sets).toStrictEqual([])
  })

  test('values', () => {
    const set = new BigSet()
    set._sets = [new Set([1, 2]), new Set([3])]

    const result = toArray(set.values())

    expect(result).toStrictEqual([1, 2, 3])
  })
})
