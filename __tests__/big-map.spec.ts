import { BigMap } from '@src/big-map.js'
import { toArray } from 'iterable-operator'

describe('BigMap', () => {
  test('[Symbol.toStringTag]', () => {
    const map = new BigMap()

    const result = map[Symbol.toStringTag]

    expect(result).toBe('BigMap')
  })

  describe('size', () => {
    test('empty', () => {
      const map = new BigMap()

      const result = map.size

      expect(result).toBe(0)
    })

    test('non-empty', () => {
      const map = new BigMap()
      map._maps = [new Map([[1, '1'], [2, '2']]), new Map([[3, '3']])]

      const result = map.size

      expect(result).toBe(3)
    })
  })

  test('[Symbol.iterator]', () => {
    const map = new BigMap()
    map._maps = [new Map([[1, '1'], [2, '2']]), new Map([[3, '3']])]

    const result = toArray(map)

    expect(result).toStrictEqual([
      [1, '1']
    , [2, '2']
    , [3, '3']
    ])
  })

  describe('set', () => {
    test('exists', () => {
      const map = new BigMap()
      map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

      map.set(2, 'b')

      expect(map._maps).toStrictEqual([
        new Map([[1, '1']])
      , new Map([[2, 'b']])
      ])
    })

    describe('does not exist', () => {
      test('normal', () => {
        const map = new BigMap()
        map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

        map.set(3, '3')

        expect(map._maps).toStrictEqual([
          new Map([[1, '1'], [3, '3']])
        , new Map([[2, '2']])
        ])
      })

      test('edge: empty', () => {
        const map = new BigMap()

        map.set(1, '1')

        expect(map._maps).toStrictEqual([
          new Map([[1, '1']])
        ])
      })

      test('edge: throws RangeError', () => {
        class RangeErrorMap<K, V> extends Map<K, V> implements Map<K, V> {
          set(): this {
            throw new RangeError('out of range')
          }
        }
        const map = new BigMap()
        map._maps = [new RangeErrorMap()]

        map.set(1, '1')

        expect(map._maps).toStrictEqual([
          new RangeErrorMap()
        , new Map([[1, '1']])
        ])
      })
    })
  })

  describe('has', () => {
    test('exists', () => {
      const map = new BigMap()
      map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

      const result = map.has(2)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const map = new BigMap()
      map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

      const result = map.has(3)

      expect(result).toBe(false)
    })
  })

  describe('get', () => {
    test('exists', () => {
      const map = new BigMap()
      map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

      const result = map.get(2)

      expect(result).toBe('2')
    })

    test('does not exist', () => {
      const map = new BigMap()
      map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

      const result = map.get(3)

      expect(result).toBe(undefined)
    })
  })

  describe('delete', () => {
    describe('exists', () => {
      test('normal', () => {
        const map = new BigMap()
        map._maps = [new Map([[1, '1'], [2, '2']]), new Map([[3, '3']])]

        const result = map.delete(2)

        expect(result).toBe(true)
        expect(map._maps).toStrictEqual([
          new Map([[1, '1']])
        , new Map([[3, '3']])
        ])
      })

      test('edge: last element of the sub map', () => {
        const map = new BigMap()
        map._maps = [new Map([[1, '1']]), new Map([[2, '2']]), new Map([[3, '3']])]

        const result = map.delete(2)

        expect(result).toBe(true)
        expect(map._maps).toStrictEqual([
          new Map([[1, '1']])
        , new Map([[3, '3']])
        ])
      })
    })

    test('does not exist', () => {
      const map = new BigMap()
      map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

      const result = map.delete(3)

      expect(result).toBe(false)
      expect(map._maps).toStrictEqual([
        new Map([[1, '1']])
      , new Map([[2, '2']])
      ])
    })
  })

  test('clear', () => {
    const map = new BigMap()
    map._maps = [new Map([[1, '1']]), new Map([[2, '2']])]

    map.clear()

    expect(map._maps).toStrictEqual([])
  })

  test('entries', () => {
    const map = new BigMap()
    map._maps = [new Map([[1, '1'], [2, '2']]), new Map([[3, '3']])]

    const result = toArray(map.entries())

    expect(result).toStrictEqual([
      [1, '1']
    , [2, '2']
    , [3, '3']
    ])
  })

  test('keys', () => {
    const map = new BigMap()
    map._maps = [new Map([[1, '1'], [2, '2']]), new Map([[3, '3']])]

    const result = toArray(map.keys())

    expect(result).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const map = new BigMap()
    map._maps = [new Map([[1, '1'], [2, '2']]), new Map([[3, '3']])]

    const result = toArray(map.values())

    expect(result).toStrictEqual(['1', '2', '3'])
  })
})
