import { TrieMap } from '@src/trie-map.js'
import { toArray } from 'iterable-operator'

describe('TrieMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new TrieMap()

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object TrieMap]')
  })

  test('entries', () => {
    const map = new TrieMap<string, number>()
    const keys = ['foobar', 'foo', 'bar']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.entries()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      [['f', 'o', 'o'], 1]
    , [['f', 'o', 'o', 'b', 'a', 'r'], 0]
    , [['b', 'a', 'r'], 2]
    ])
  })

  test('keys', () => {
    const map = new TrieMap<string, number>()
    const keys = ['foobar', 'foo', 'bar']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      ['f', 'o', 'o']
    , ['f', 'o', 'o', 'b', 'a', 'r']
    , ['b', 'a', 'r']
    ])
  })

  test('values', () => {
    const map = new TrieMap<string, number>()
    const keys = ['foobar', 'foo', 'bar']
    for (const [i, key] of keys.entries()) {
      map.set(key, i)
    }

    const iter = map.values()
    const result = toArray(iter)

    expect(result).toStrictEqual([1, 0, 2])
  })

  test('set(key: K, value: V): this', () => {
    const map = new TrieMap<string[], string>()
    const key = ['foo', 'bar']

    map.set(key, 'foo bar')

    expect(map.has(key)).toBe(true)
  })

  describe('has(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new TrieMap<string[], string>()
        const key = ['foo', 'bar']
        map.set(key, 'foo bar')

        const result = map.has(key)

        expect(result).toBe(true)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new TrieMap<string[], string>()
        const key = ['foo', 'bar']

        const result = map.has(key)

        expect(result).toBe(false)
      })
    })
  })

  describe('get(key: K): V | undefined', () => {
    describe('exists', () => {
      it('return V', () => {
        const map = new TrieMap<string[], string>()
        const key = ['foo', 'bar']
        const value = 'foo bar'
        map.set(key, value)

        const result = map.get(key)

        expect(result).toBe(value)
      })
    })

    describe('does not exists', () => {
      it('return undefined', () => {
        const map = new TrieMap<string[], string>()
        const key = ['foo', 'bar']

        const result = map.get(key)

        expect(result).toBeUndefined()
      })
    })
  })

  describe('delete(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new TrieMap<string[], string>()
        const key = ['foo', 'bar']
        const value = 'foo bar'
        map.set(key, value)

        const result = map.delete(key)

        expect(result).toBe(true)
        expect(map.has(key)).toBe(false)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new TrieMap<string[], string>()
        const key = ['foo', 'bar']

        const result = map.delete(key)

        expect(result).toBe(false)
        expect(map.has(key)).toBe(false)
      })
    })
  })
})
