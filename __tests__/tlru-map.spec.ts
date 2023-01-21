import { TLRUMap } from '@src/tlru-map.js'
import { delay } from 'extra-promise'

const TIME_ERROR = 1

class TLRUMapTest<K, V> extends TLRUMap<K, V> {
  getItemMetadataSortedByExpirationTime() {
    return this.itemMetadataSortedByExpirationTime
  }
}

describe('TLRUMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new TLRUMap(100)

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object TLRUMap]')
  })

  test('size', () => {
    const map = new TLRUMap(100)

    const result1 =  map.size
    map.set('item #1', 'value', Infinity)
    map.set('item #2', 'value', Infinity)
    const result2 =  map.size
    map.delete('item #1')
    const result3 =  map.size
    map.clear()
    const result4 =  map.size

    expect(result1).toBe(0)
    expect(result2).toBe(2)
    expect(result3).toBe(1)
    expect(result4).toBe(0)
  })

  test('items expired', async () => {
    const map = new TLRUMapTest(100)

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

  describe('set', () => {
    test('not full', () => {
      const map = new TLRUMap(1)

      map.set('key', 'value', Infinity)

      expect(map.size).toBe(1)
      expect(map.has('key')).toBe(true)
    })

    test('full', () => {
      const map = new TLRUMap(2)

      map.set('item #1', 1, Infinity) // coldest ['item #1'] hottest
      map.set('item #2', 2, Infinity) // coldest ['item #1', 'item #2'] hottest
      map.get('item #1') // coldest ['item #2', 'item #1'] hottest
      map.set('item #3', 3, Infinity) // coldest ['item #1', 'item #3'] hottest

      expect(map.size).toBe(2)
      expect(map.has('item #1')).toBe(true)
      expect(map.has('item #2')).toBe(false)
      expect(map.has('item #3')).toBe(true)
    })
  })

  describe('has', () => {
    test('exists', () => {
      const map = new TLRUMap(100)
      map.set('key', 'value', Infinity)

      const result = map.has('key')

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const map = new TLRUMap(100)

      const result = map.has('key')

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('exists', () => {
      const map = new TLRUMap(100)
      map.set('key', 'value', Infinity)

      const result = map.get('key')

      expect(result).toBe('value')
    })

    test('does not exist', () => {
      const map = new TLRUMap(100)

      const result = map.get('key')

      expect(result).toBeUndefined()
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const map = new TLRUMapTest(100)
      map.set('key', 'value', Infinity)

      const result = map.delete('key')

      expect(result).toBe(true)
      expect(map.has('key')).toBe(false)
      expect(map.getItemMetadataSortedByExpirationTime().length).toBe(0)
    })

    test('does not exist', () => {
      const map = new TLRUMapTest(100)

      const result = map.delete('key')

      expect(result).toBe(false)
      expect(map.has('key')).toBe(false)
      expect(map.getItemMetadataSortedByExpirationTime().length).toBe(0)
    })
  })

  test('clear', () => {
    const map = new TLRUMapTest(100)
    map.set('key', 'value', Infinity)

    map.clear()

    expect(map.size).toBe(0)
    expect(map.getItemMetadataSortedByExpirationTime().length).toBe(0)
  })
})
