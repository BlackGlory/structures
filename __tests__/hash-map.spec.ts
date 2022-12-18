import { HashMap } from '@src/hash-map'

describe('HashMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new HashMap(JSON.stringify)

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object HashMap]')
  })

  test('size', () => {
    const map = new HashMap(JSON.stringify)

    map.set(1, 'value')
    const result1 = map.size
    map.delete(1)
    const result2 = map.size

    expect(result1).toBe(1)
    expect(result2).toBe(0)
  })

  test('set(key: K, value: V): this', () => {
    const map = new HashMap(JSON.stringify)
    map.set({ key: 'key' }, 'old value')

    const result = map.set({ key: 'key' }, 'new value')

    expect(map.size).toBe(1)
    expect(map.get({ key: 'key' })).toBe('new value')
    expect(result).toBe(map)
  })

  describe('delete(key: K): this', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new HashMap(JSON.stringify)
        map.set(1, 'value')

        const result = map.delete(1)

        expect(result).toBe(true)
      })
    })

    describe('does not exists', () => {
      it('return false', () => {
        const map = new HashMap(JSON.stringify)

        const result = map.delete(1)

        expect(result).toBe(false)
      })
    })
  })

  describe('has(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new HashMap(JSON.stringify)
        map.set(1, 'value')

        const result = map.has(1)

        expect(result).toBe(true)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new HashMap(JSON.stringify)

        const result = map.has(1)

        expect(result).toBe(false)
      })
    })
  })

  test('clear(): void', () => {
    const map = new HashMap(JSON.stringify)
    map.set(1, 'value')

    const result = map.clear()

    expect(result).toBeUndefined()
    expect(map.size).toBe(0)
  })
})
