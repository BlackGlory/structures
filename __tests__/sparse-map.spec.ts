import { SparseMap } from '@src/sparse-map'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('SparseMap', () => {
  test('has', () => {
    const map = new SparseMap<string>()
    map.set(1, '1')

    const result1 = map.has(1)
    const result2 = map.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('set', () => {
    const map = new SparseMap<string>()

    map.set(1, '1')
    map.set(2, '2')

    expect(map.has(0)).toBe(false)
    expect(map.has(1)).toBe(true)
    expect(map.has(2)).toBe(true)
  })

  test('remove', () => {
    const map = new SparseMap<string>()
    map.set(1, '1')
    map.set(2, '2')

    map.delete(1)

    expect(map.has(1)).toBe(false)
    expect(map.has(2)).toBe(true)
  })

  test('entries', () => {
    const set = new SparseMap<string>()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const result = set.entries()
    const arr = toArray(result)

    expect(result).toBeIterable()
    expect(arr).toStrictEqual([
      [1, '1']
    , [2, '2']
    , [3, '3']
    ])
  })

  test('keys', () => {
    const set = new SparseMap<string>()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const result = set.keys()
    const arr = toArray(result)

    expect(result).toBeIterable()
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const set = new SparseMap<string>()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const result = set.values()
    const arr = toArray(result)

    expect(result).toBeIterable()
    expect(arr).toStrictEqual(['1', '2', '3'])
  })

  test('edge: delete', () => {
    const set = new SparseMap<string>()
    set.set(1, '1')

    set.delete(1)

    expect(set.has(1)).toBe(false)
  })
})
