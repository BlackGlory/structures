import { LRUMap } from '@src/lru-map.js'

describe('LRUMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new LRUMap(100)

    const result = Object.prototype.toString.call(map)

    expect(result).toBe('[object LRUMap]')
  })

  test('size', () => {
    const map = new LRUMap(100)

    const result1 =  map.size
    map.set('item #1', 'value')
    map.set('item #2', 'value')
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

  describe('set(key: K, value: V): this', () => {
    test('not full', () => {
      const map = new LRUMap(1)

      map.set('key', 'value')

      expect(map.size).toBe(1)
      expect(map.has('key')).toBe(true)
    })

    test('full', () => {
      const map = new LRUMap(2)

      map.set('item #1', 1) // coldest ['item #1'] hottest
      map.set('item #2', 2) // coldest ['item #1', 'item #2'] hottest
      map.get('item #1') // coldest ['item #2', 'item #1'] hottest
      map.set('item #3', 3) // coldest ['item #1', 'item #3'] hottest

      expect(map.size).toBe(2)
      expect(map.has('item #1')).toBe(true)
      expect(map.has('item #2')).toBe(false)
      expect(map.has('item #3')).toBe(true)
    })
  })

  describe('has(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new LRUMap(100)
        map.set('key', 'value')

        const result = map.has('key')

        expect(result).toBe(true)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new LRUMap(100)

        const result = map.has('key')

        expect(result).toBe(false)
      })
    })
  })

  describe('get(key: K): V | undefined', () => {
    describe('exists', () => {
      it('return V', () => {
        const map = new LRUMap(100)
        map.set('key', 'value')

        const result = map.get('key')

        expect(result).toBe('value')
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const map = new LRUMap(100)

        const result = map.get('key')

        expect(result).toBeUndefined()
      })
    })
  })

  describe('delete(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new LRUMap(100)
        map.set('key', 'value')

        const result = map.delete('key')

        expect(result).toBe(true)
        expect(map.has('key')).toBe(false)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new LRUMap(100)

        const result = map.delete('key')

        expect(result).toBe(false)
        expect(map.has('key')).toBe(false)
      })
    })
  })

  test('clear(): void', () => {
    const map = new LRUMap(100)
    map.set('key', 'value')

    map.clear()

    expect(map.size).toBe(0)
  })
})
