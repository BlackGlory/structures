import { describe, test, expect } from 'vitest'
import { RadixTree, findCommonPrefix, getCommonPrefix, matchPrefix } from '@src/radix-tree.js'
import { toArray } from 'iterable-operator'

describe('RadixTree', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new RadixTree()

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object RadixTree]')
  })

  test('entries', () => {
    const map = new RadixTree<string, number>()
    const keys = ['foo', 'foobar', 'bar', 'baz']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.entries()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      [['f', 'o', 'o'], 0]
    , [['f', 'o', 'o', 'b', 'a', 'r'], 1]
    , [['b', 'a', 'r'], 2]
    , [['b', 'a', 'z'], 3]
    ])
  })

  test('keys', () => {
    const map = new RadixTree<string, number>()
    const keys = ['foo', 'foobar', 'bar', 'baz']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      ['f', 'o', 'o']
    , ['f', 'o', 'o', 'b', 'a', 'r']
    , ['b', 'a', 'r']
    , ['b', 'a', 'z']
    ])
  })

  test('values', () => {
    const map = new RadixTree<string, number>()
    const keys = ['foo', 'foobar', 'bar', 'baz']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.values()
    const result = toArray(iter)

    expect(result).toStrictEqual([0, 1, 2, 3])
  })

  test('set', () => {
    const map = new RadixTree<string, string>()
    const key = 'key'

    map.set(key, 'value')

    expect(map.has(key)).toBe(true)
  })

  describe('has', () => {
    test('exists', () => {
      const map = new RadixTree<string, string>()
      const key = 'key'
      map.set(key, 'value')

      const result = map.has(key)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const map = new RadixTree<string, string>()
      const key = 'key'

      const result = map.has(key)

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('exists', () => {
      const map = new RadixTree<string, string>()
      const key = 'key'
      const value = 'value'
      map.set(key, value)

      const result = map.get(key)

      expect(result).toBe(value)
    })

    test('does not exists', () => {
      const map = new RadixTree<string, string>()
      const key = 'key'

      const result = map.get(key)

      expect(result).toBeUndefined()
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const map = new RadixTree<string, string>()
      const key = 'key'
      const value = 'value'
      map.set(key, value)

      const result = map.delete(key)

      expect(result).toBe(true)
      expect(map.has(key)).toBe(false)
    })

    test('does not exist', () => {
      const map = new RadixTree<string, string>()
      const key = 'key'

      const result = map.delete(key)

      expect(result).toBe(false)
      expect(map.has(key)).toBe(false)
    })
  })
})

describe('matchPrefix', () => {
  test('matched', () => {
    const prefixes = [
      ['f', 'o', 'o']
    , ['b', 'a', 'r']
    ]
    const text = [
      'f', 'o', 'o', 'b', 'a', 'r'
    ]

    const result = matchPrefix(prefixes, text)

    expect(result).toStrictEqual([
      'f', 'o', 'o'
    ])
  })

  test('did not match', () => {
    const prefixes = [['for'], ['bar']]
    const text = ['foobar']

    const result = matchPrefix(prefixes, text)

    expect(result).toBe(undefined)
  })
})

describe('findCommonPrefix', () => {
  describe('found', () => {
    test('full match', () => {
      const prefixes = [
        ['f', 'o', 'o']
      , ['b', 'a', 'r']
      ]
      const text = [
        'f', 'o', 'o', 'b', 'a', 'r'
      ]

      const result = findCommonPrefix(prefixes, text)

      expect(result).toStrictEqual({
        prefix: ['f', 'o', 'o']
      , commonPartLength: 3
      })
    })

    test('partial match', () => {
      const prefixes = [
        ['f', 'o', 'r']
      , ['b', 'a', 'r']
      ]
      const text = [
        'f', 'o', 'o', 'b', 'a', 'r'
      ]

      const result = findCommonPrefix(prefixes, text)

      expect(result).toStrictEqual({
        prefix: ['f', 'o', 'r']
      , commonPartLength: 2
      })
    })
  })

  test('not found', () => {
    const prefixes = [
      ['b', 'a', 'r']
    , ['b', 'a', 'z']
    ]
    const text = [
      'f', 'o', 'o', 'b', 'a', 'r'
    ]

    const result = findCommonPrefix(prefixes, text)

    expect(result).toBe(undefined)
  })
})

describe('getCommonPrefix', () => {
  test('with common prefix', () => {
    const prefixes = [
      ['f', 'o', 'o', 'b', 'a', 'r']
    , ['f', 'o', 'r', 'b', 'a', 'r']
    ]

    const result = getCommonPrefix(prefixes)

    expect(result).toStrictEqual([
      'f', 'o'
    ])
  })

  test('without common prefix', () => {
    const prefixes = [
      ['f', 'o', 'o']
    , ['b', 'a', 'r']
    ]

    const result = getCommonPrefix(prefixes)

    expect(result).toStrictEqual([])
  })
})
