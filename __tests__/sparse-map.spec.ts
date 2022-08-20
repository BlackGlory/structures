import { SparseMap } from '@src/sparse-map'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('SparseMap', () => {
  test('has', () => {
    const map = new SparseMap()
    map.set(1, 10)

    const result1 = map.has(1)
    const result2 = map.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('set', () => {
    const map = new SparseMap()

    map.set(1, 10)
    map.set(2, 20)

    expect(map.has(0)).toBe(false)
    expect(map.has(1)).toBe(true)
    expect(map.has(2)).toBe(true)
  })

  describe('delete', () => {
    test('not last item', () => {
      const map = new SparseMap()
      map.set(1, 10)
      map.set(2, 20)

      map.delete(1)

      expect(map.has(1)).toBe(false)
      expect(map.has(2)).toBe(true)
    })

    test('last item', () => {
      const set = new SparseMap()
      set.set(1, 10)

      set.delete(1)

      expect(set.has(1)).toBe(false)
    })
  })

  test('entries', () => {
    const set = new SparseMap()
    set.set(1, 10)
    set.set(2, 20)
    set.set(3, 30)

    const result = set.entries()
    const arr = toArray(result)

    expect(result).toBeIterable()
    expect(arr).toStrictEqual([
      [1, 10]
    , [2, 20]
    , [3, 30]
    ])
  })

  test('keys', () => {
    const set = new SparseMap()
    set.set(1, 10)
    set.set(2, 20)
    set.set(3, 30)

    const result = set.keys()
    const arr = toArray(result)

    expect(result).toBeIterable()
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const set = new SparseMap()
    set.set(1, 10)
    set.set(2, 20)
    set.set(3, 30)

    const result = set.values()
    const arr = toArray(result)

    expect(result).toBeIterable()
    expect(arr).toStrictEqual([10, 20, 30])
  })
})
