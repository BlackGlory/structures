import { ExpirableMap } from '@src/expirable-map'
import { delay } from 'extra-promise'

class ExpirableMapTest<K, V> extends ExpirableMap<K, V> {
  getItemsSortedByExpirationTime() {
    return this.itemsSortedByExpirationTime
  }
}

describe('ExpirableMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new ExpirableMap()

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object ExpirableMap]')
  })

  test('size', () => {
    const map = new ExpirableMap()

    const result1 = map.size
    map.set('hello', 'world', Infinity)
    map.set('world', 'hello', Infinity)
    const result2 = map.size
    map.delete('hello')
    const result3 = map.size
    map.clear()
    const result4 = map.size

    expect(result1).toBe(0)
    expect(result2).toBe(2)
    expect(result3).toBe(1)
    expect(result4).toBe(0)
  })

  test('items expired', async () => {
    const map = new ExpirableMapTest()

    map.set('item #1', 'value', 500)
    map.set('item #2', 'value', 1000)
    const size1 = map.size
    const length1 = map.getItemsSortedByExpirationTime().length
    await delay(500)
    const size2 = map.size
    const length2 = map.getItemsSortedByExpirationTime().length
    await delay(500)
    const size3 = map.size
    const length3 = map.getItemsSortedByExpirationTime().length

    expect(size1).toBe(2)
    expect(length1).toBe(2)
    expect(size2).toBe(1)
    expect(length2).toBe(1)
    expect(size3).toBe(0)
    expect(length3).toBe(0)
  })

  test('set(key: K, value: V, maxAge: number): this', () => {
    const map = new ExpirableMapTest()

    map.set('item #1', 'value', Infinity)
    map.set('item #2', 'value', 500)
    map.set('item #3', 'value', 1000)

    expect(map.size).toBe(3)
    expect(map.has('item #1')).toBe(true)
    expect(map.has('item #2')).toBe(true)
    expect(map.has('item #3')).toBe(true)
    expect(map.getItemsSortedByExpirationTime()).toMatchObject([
      {
        key: 'item #2'
      , expirationTime: expect.any(Number)
      }
    , {
        key: 'item #3'
      , expirationTime: expect.any(Number)
      }
    , {
        key: 'item #1'
      , expirationTime: Infinity
      }
    ])
  })

  describe('has(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new ExpirableMap()
        map.set('key', 'value', Infinity)

        const result = map.has('key')

        expect(result).toBe(true)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new ExpirableMap()

        const result = map.has('key')

        expect(result).toBe(false)
      })
    })
  })

  describe('get(key: K): V | undefined', () => {
    describe('exists', () => {
      it('return V', () => {
        const map = new ExpirableMap()
        map.set('key', 'value', Infinity)

        const result = map.get('key')

        expect(result).toBe('value')
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const map = new ExpirableMap()

        const result = map.get('key')

        expect(result).toBeUndefined()
      })
    })
  })

  describe('delete(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new ExpirableMap()
        map.set('key', 'value', Infinity)

        const result = map.delete('key')

        expect(result).toBe(true)
        expect(map.has('key')).toBe(false)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new ExpirableMap()

        const result = map.delete('key')

        expect(result).toBe(false)
        expect(map.has('key')).toBe(false)
      })
    })
  })

  test('clear(): void', () => {
    const map = new ExpirableMapTest()
    map.set('key', 'value', Infinity)

    map.clear()

    expect(map.size).toBe(0)
    expect(map.getItemsSortedByExpirationTime()).toStrictEqual([])
  })
})
