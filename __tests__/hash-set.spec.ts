import { describe, test, expect, it } from 'vitest'
import { HashSet } from '@src/hash-set.js'
import { toArray } from 'iterable-operator'

describe('HashSet', () => {
  test('[Symbol.toStringTag]', () => {
    const set = new HashSet<number>(JSON.stringify)

    const result = Object.prototype.toString.call(set)

    expect(result).toBe('[object HashSet]')
  })

  test('size', () => {
    const set = new HashSet<number>(JSON.stringify)

    set.add(1)
    const result1 = set.size
    set.delete(1)
    const result2 = set.size

    expect(result1).toBe(1)
    expect(result2).toBe(0)
  })

  test('[Symbol.iterator]', () => {
    const set = new HashSet<number>(JSON.stringify)
    set.add(1)

    const result = toArray(set)

    expect(result).toStrictEqual([1])
  })

  test('add(value: T) => this', () => {
    const set = new HashSet<object>(JSON.stringify)
    set.add({ key: 'value' })

    const result = set.add({ key: 'value' })

    expect(set.size).toBe(1)
    expect(result).toBe(set)
  })

  describe('delete(value: T): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const set = new HashSet<object>(JSON.stringify)
        set.add({ key: 'value' })

        const result = set.delete({ key: 'value' })

        expect(result).toBe(true)
        expect(set.size).toBe(0)
      })
    })

    describe('does not exists', () => {
      it('return false', () => {
        const set = new HashSet<object>(JSON.stringify)

        const result = set.delete({ key: 'value' })

        expect(result).toBe(false)
        expect(set.size).toBe(0)
      })
    })
  })

  describe('has(value: T): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const set = new HashSet<object>(JSON.stringify)
        set.add({ key: 'value' })

        const result = set.has({ key: 'value' })

        expect(result).toBe(true)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const set = new HashSet<object>(JSON.stringify)

        const result = set.has({ key: 'value' })

        expect(result).toBe(false)
      })
    })
  })

  describe('get', () => {
    test('exists', () => {
      const set = new HashSet<object>(JSON.stringify)
      const value = { key: 'value' }
      set.add(value)

      const result = set.get({ key: 'value' })

      expect(result).toBe(value)
    })

    test('does not exist', () => {
      const set = new HashSet<object>(JSON.stringify)

      const result = set.get({ key: 'value' })

      expect(result).toBeUndefined()
    })
  })

  test('clear(): void', () => {
    const set = new HashSet<object>(JSON.stringify)
    set.add({ key: 'value' })

    const result = set.clear()

    expect(result).toBeUndefined()
    expect(set.size).toBe(0)
  })

  test('keys', () => {
    const set = new HashSet<number>(JSON.stringify)
    set.add(1)

    const iter = set.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual([1])
  })

  test('values', () => {
    const set = new HashSet<number>(JSON.stringify)
    set.add(1)

    const iter = set.values()
    const result = toArray(iter)

    expect(result).toStrictEqual([1])
  })
})
