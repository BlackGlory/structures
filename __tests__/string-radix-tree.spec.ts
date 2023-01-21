import { StringRadixTree, findCommonPrefix, getCommonPrefix, matchPrefix } from '@src/string-radix-tree.js'
import { toArray } from 'iterable-operator'

describe('StringRadixTree', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new StringRadixTree()

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object StringRadixTree]')
  })

  test('entries', () => {
    const map = new StringRadixTree<number>()
    const keys = ['foo', 'foobar', 'bar', 'baz']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.entries()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      ['foo', 0]
    , ['foobar', 1]
    , ['bar', 2]
    , ['baz', 3]
    ])
  })

  test('keys', () => {
    const map = new StringRadixTree<number>()
    const keys = ['foo', 'foobar', 'bar', 'baz']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      'foo'
    , 'foobar'
    , 'bar'
    , 'baz'
    ])
  })

  test('values', () => {
    const map = new StringRadixTree<number>()
    const keys = ['foo', 'foobar', 'bar', 'baz']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.values()
    const result = toArray(iter)

    expect(result).toStrictEqual([0, 1, 2, 3])
  })

  test('set', () => {
    const map = new StringRadixTree<string>()
    const key = 'key'

    map.set(key, 'value')

    expect(map.has(key)).toBe(true)
  })

  describe('has', () => {
    test('exists', () => {
      const map = new StringRadixTree<string>()
      const key = 'key'
      map.set(key, 'value')

      const result = map.has(key)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const map = new StringRadixTree<string>()
      const key = 'key'

      const result = map.has(key)

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('exists', () => {
      const map = new StringRadixTree<string>()
      const key = 'key'
      const value = 'value'
      map.set(key, value)

      const result = map.get(key)

      expect(result).toBe(value)
    })

    test('does not exists', () => {
      const map = new StringRadixTree<string>()
      const key = 'key'

      const result = map.get(key)

      expect(result).toBeUndefined()
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const map = new StringRadixTree<string>()
      const key = 'key'
      const value = 'value'
      map.set(key, value)

      const result = map.delete(key)

      expect(result).toBe(true)
      expect(map.has(key)).toBe(false)
    })

    test('does not exist', () => {
      const map = new StringRadixTree<string>()
      const key = 'key'

      const result = map.delete(key)

      expect(result).toBe(false)
      expect(map.has(key)).toBe(false)
    })
  })
})

describe('matchPrefix', () => {
  test('matched', () => {
    const prefixes = ['foo', 'bar']
    const text = 'foobar'

    const result = matchPrefix(prefixes, text)

    expect(result).toBe('foo')
  })

  test('did not match', () => {
    const prefixes = ['for', 'bar']
    const text = 'foobar'

    const result = matchPrefix(prefixes, text)

    expect(result).toBe(undefined)
  })
})

describe('findCommonPrefix', () => {
  describe('found', () => {
    test('full match', () => {
      const prefixes = ['foo', 'bar']
      const text = 'foobar'

      const result = findCommonPrefix(prefixes, text)

      expect(result).toStrictEqual({
        prefix: 'foo'
      , commonPartLength: 3
      })
    })

    test('partial match', () => {
      const prefixes = ['for', 'bar']
      const text = 'foobar'

      const result = findCommonPrefix(prefixes, text)

      expect(result).toStrictEqual({
        prefix: 'for'
      , commonPartLength: 2
      })
    })
  })

  test('not found', () => {
    const prefixes = ['bar', 'baz']
    const text = 'foobar'

    const result = findCommonPrefix(prefixes, text)

    expect(result).toBe(undefined)
  })
})

describe('getCommonPrefix', () => {
  test('with common prefix', () => {
    const prefixes = ['foobar', 'forbar']

    const result = getCommonPrefix(prefixes)

    expect(result).toBe('fo')
  })

  test('without common prefix', () => {
    const prefixes = ['foo', 'bar']

    const result = getCommonPrefix(prefixes)

    expect(result).toBe('')
  })
})
