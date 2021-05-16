import { TrieMap } from '@src/trie-map'

describe('TrieMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new TrieMap()

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object TrieMap]')
  })

  test('set(key: K, value: V): this', () => {
    const map = new TrieMap<string[], string>()
    const key = ['hello', 'world']

    map.set(key, 'hello world')

    expect(map.has(key)).toBe(true)
  })

  describe('has(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new TrieMap<string[], string>()
        const key = ['hello', 'world']
        map.set(key, 'hello world')

        const result = map.has(key)

        expect(result).toBe(true)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new TrieMap<string[], string>()
        const key = ['hello', 'world']

        const result = map.has(key)

        expect(result).toBe(false)
      })
    })
  })

  describe('get(key: K): V | undefined', () => {
    describe('exists', () => {
      it('return V', () => {
        const map = new TrieMap<string[], string>()
        const key = ['hello', 'world']
        const value = 'hello world'
        map.set(key, value)

        const result = map.get(key)

        expect(result).toBe(value)
      })
    })

    describe('does not exists', () => {
      it('return undefined', () => {
        const map = new TrieMap<string[], string>()
        const key = ['hello', 'world']

        const result = map.get(key)

        expect(result).toBeUndefined()
      })
    })
  })

  describe('delete(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new TrieMap<string[], string>()
        const key = ['hello', 'world']
        const value = 'hello world'
        map.set(key, value)

        const result = map.delete(key)

        expect(result).toBe(true)
        expect(map.has(key)).toBe(false)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new TrieMap<string[], string>()
        const key = ['hello', 'world']

        const result = map.delete(key)

        expect(result).toBe(false)
        expect(map.has(key)).toBe(false)
      })
    })
  })
})
