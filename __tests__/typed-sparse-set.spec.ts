import { TypedSparseSet } from '@src/typed-sparse-set'
import { DynamicTypedArray } from '@src/dynamic-typed-array'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('TypedSparseSet', () => {
  test('create', () => {
    const array = new DynamicTypedArray(Uint8Array)
    array.set(0, 1)
    array.set(1, 2)

    const set = new TypedSparseSet(array)

    expect(set.has(0)).toBe(false)
    expect(set.has(1)).toBe(true)
    expect(set.has(2)).toBe(true)
    expect(set.has(3)).toBe(false)
  })

  test('has', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
    set.add(1)

    const result1 = set.has(1)
    const result2 = set.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('add', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))

    set.add(1)
    set.add(2)

    expect(set.has(0)).toBe(false)
    expect(set.has(1)).toBe(true)
    expect(set.has(2)).toBe(true)
  })

  describe('delete', () => {
    test('not last item', () => {
      const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
      set.add(1)
      set.add(2)

      set.delete(1)

      expect(set.has(1)).toBe(false)
      expect(set.has(2)).toBe(true)
    })

    test('last item', () => {
      const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array))
      set.add(1)

      set.delete(1)

      expect(set.has(1)).toBe(false)
    })
  })

  test('[Symbol.iterator]', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array, { capacity: 100 }))
    set.add(1)
    set.add(2)
    set.add(3)

    const arr = toArray(set)

    expect(set).toBeIterable()
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const set = new TypedSparseSet(new DynamicTypedArray(Uint8Array, { capacity: 100 }))
    set.add(1)
    set.add(2)
    set.add(3)

    const result = set.values()
    const arrResult = toArray(result)

    expect(result).toBeIterable()
    expect(arrResult).toStrictEqual([1, 2, 3])
  })
})
