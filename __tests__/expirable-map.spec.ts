import { ExpirableMap } from '@src/expirable-map.js'
import { delay } from 'extra-promise'

const TIME_ERROR = 1

class ExpirableMapTest<K, V> extends ExpirableMap<K, V> {
  getItemMetadataSortedByExpirationTime() {
    return this.itemMetadataSortedByExpirationTime
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
    map.set('item #1', 'value', Infinity)
    map.set('item #2', 'value', Infinity)
    const result2 = map.size
    map.delete('item #1')
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

    map.set('item #1', 'value', 500 - TIME_ERROR)
    map.set('item #2', 'value', 1000 - TIME_ERROR)
    const size1 = map.size
    const length1 = map.getItemMetadataSortedByExpirationTime().length
    await delay(500 + TIME_ERROR)
    const size2 = map.size
    const length2 = map.getItemMetadataSortedByExpirationTime().length
    await delay(500 + TIME_ERROR)
    const size3 = map.size
    const length3 = map.getItemMetadataSortedByExpirationTime().length

    expect(size1).toBe(2)
    expect(length1).toBe(2)
    expect(size2).toBe(1)
    expect(length2).toBe(1)
    expect(size3).toBe(0)
    expect(length3).toBe(0)
  })

  test('set', () => {
    const map = new ExpirableMapTest()

    map.set('item #1', 'value', Infinity)
    map.set('item #2', 'value', 500)
    map.set('item #3', 'value', 1000)

    expect(map.size).toBe(3)
    expect(map.has('item #1')).toBe(true)
    expect(map.has('item #2')).toBe(true)
    expect(map.has('item #3')).toBe(true)
    expect(map.getItemMetadataSortedByExpirationTime()).toMatchObject([
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

  describe('has', () => {
    test('exists', () => {
      const map = new ExpirableMap()
      map.set('key', 'value', Infinity)

      const result = map.has('key')

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const map = new ExpirableMap()

      const result = map.has('key')

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('exists', () => {
      const map = new ExpirableMap()
      map.set('key', 'value', Infinity)

      const result = map.get('key')

      expect(result).toBe('value')
    })

    test('does not exist', () => {
      const map = new ExpirableMap()

      const result = map.get('key')

      expect(result).toBeUndefined()
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const map = new ExpirableMap()
      map.set('key', 'value', Infinity)

      const result = map.delete('key')

      expect(result).toBe(true)
      expect(map.has('key')).toBe(false)
    })

    test('does not exist', () => {
      const map = new ExpirableMap()

      const result = map.delete('key')

      expect(result).toBe(false)
      expect(map.has('key')).toBe(false)
    })
  })

  test('clear', () => {
    const map = new ExpirableMapTest()
    map.set('key', 'value', Infinity)

    map.clear()

    expect(map.size).toBe(0)
    expect(map.getItemMetadataSortedByExpirationTime().length).toBe(0)
  })
})
