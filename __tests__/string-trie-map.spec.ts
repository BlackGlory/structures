import { StringTrieMap } from '@src/string-trie-map'
import { toArray } from 'iterable-operator'

describe('StringTrieMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new StringTrieMap()

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object StringTrieMap]')
  })

  test('entries', () => {
    const map = new StringTrieMap<number>()
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
    const map = new StringTrieMap<number>()
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
    const map = new StringTrieMap<number>()
    const keys = ['foo', 'foobar', 'bar', 'baz']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.values()
    const result = toArray(iter)

    expect(result).toStrictEqual([0, 1, 2, 3])
  })

  test('set', () => {
    const map = new StringTrieMap<string>()
    const key = 'key'

    map.set(key, 'value')

    expect(map.has(key)).toBe(true)
  })

  describe('has', () => {
    test('exists', () => {
      const map = new StringTrieMap<string>()
      const key = 'key'
      map.set(key, 'value')

      const result = map.has(key)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const map = new StringTrieMap<string>()
      const key = 'key'

      const result = map.has(key)

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('exists', () => {
      const map = new StringTrieMap<string>()
      const key = 'key'
      const value = 'value'
      map.set(key, value)

      const result = map.get(key)

      expect(result).toBe(value)
    })

    test('does not exists', () => {
      const map = new StringTrieMap<string>()
      const key = 'key'

      const result = map.get(key)

      expect(result).toBeUndefined()
    })
  })

  describe('delete(key: K): boolean', () => {
    test('exists', () => {
      const map = new StringTrieMap<string>()
      const key = 'key'
      const value = 'value'
      map.set(key, value)

      const result = map.delete(key)

      expect(result).toBe(true)
      expect(map.has(key)).toBe(false)
    })

    test('does not exist', () => {
      const map = new StringTrieMap<string>()
      const key = 'key'

      const result = map.delete(key)

      expect(result).toBe(false)
      expect(map.has(key)).toBe(false)
    })
  })
})
