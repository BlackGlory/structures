import { LRUMap, NotFoundError } from '@src/lru-map'
import { getError } from 'return-style'

describe('LRUMap', () => {
  test('[Symbol.toStringTag]', () => {
    const set = new LRUMap(100)

    const result = Object.prototype.toString.call(set)

    expect(result).toBe('[object LRUMap]')
  })

  test('size', () => {
    const map = new LRUMap(100)

    const result1 =  map.size
    map.set('hello', 'world')
    map.set('world', 'hello')
    const result2 =  map.size
    map.delete('hello')
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

      map.set('hello', 'world')

      expect(map.size).toBe(1)
      expect(map.has('hello')).toBe(true)
    })

    test('full', () => {
      const map = new LRUMap(2)

      map.set('hello', 1) // coldest ['hello'] hottest
      map.set('world', 2) // coldest ['hello', 'world'] hottest
      map.get('hello') // coldest ['world', 'hello'] hottest
      map.set('lru', 3) // coldest ['hello', 'lru'] hottest

      expect(map.size).toBe(2)
      expect(map.has('hello')).toBe(true)
      expect(map.has('lru')).toBe(true)
      expect(map.has('world')).toBe(false)
    })
  })

  describe('has(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new LRUMap(100)
        map.set('hello', 'world')

        const result = map.has('hello')

        expect(result).toBe(true)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new LRUMap(100)

        const result = map.has('hello')

        expect(result).toBe(false)
      })
    })
  })

  describe('get(key: K): V', () => {
    describe('exists', () => {
      it('return V', () => {
        const map = new LRUMap(100)
        map.set('hello', 'world')

        const result = map.get('hello')

        expect(result).toBe('world')
      })
    })

    describe('does not exist', () => {
      it('throw NotFoundError', () => {
        const map = new LRUMap(100)

        const err = getError(() => map.get('hello'))

        expect(err).toBeInstanceOf(NotFoundError)
      })
    })
  })

  describe('tryGet(key: K): V | undefined', () => {
    describe('exists', () => {
      it('return V', () => {
        const map = new LRUMap(100)
        map.set('hello', 'world')

        const result = map.tryGet('hello')

        expect(result).toBe('world')
      })
    })

    describe('does not exist', () => {
      it('return undefined', () => {
        const map = new LRUMap(100)

        const result = map.tryGet('hello')

        expect(result).toBeUndefined()
      })
    })
  })

  describe('delete(key: K): boolean', () => {
    describe('exists', () => {
      it('return true', () => {
        const map = new LRUMap(100)
        map.set('hello', 'world')

        const result = map.delete('hello')

        expect(result).toBe(true)
        expect(map.has('hello')).toBe(false)
      })
    })

    describe('does not exist', () => {
      it('return false', () => {
        const map = new LRUMap(100)

        const result = map.delete('hello')

        expect(result).toBe(false)
        expect(map.has('hello')).toBe(false)
      })
    })
  })

  test('clear(): void', () => {
    const map = new LRUMap(100)
    map.set('hello', 'world')

    map.clear()

    expect(map.size).toBe(0)
  })
})
