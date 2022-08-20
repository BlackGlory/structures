import { SparseSet } from '@src/sparse-set'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('SparseSet', () => {
  test('has', () => {
    const set = new SparseSet()
    set.add(1)

    const result1 = set.has(1)
    const result2 = set.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('add', () => {
    const set = new SparseSet()

    set.add(1)
    set.add(2)

    expect(set.has(0)).toBe(false)
    expect(set.has(1)).toBe(true)
    expect(set.has(2)).toBe(true)
  })

  test('delete', () => {
    const set = new SparseSet()
    set.add(1)
    set.add(2)

    set.delete(1)

    expect(set.has(1)).toBe(false)
    expect(set.has(2)).toBe(true)
  })

  test('[Symbol.iterator]', () => {
    const set = new SparseSet()
    set.add(1)
    set.add(2)
    set.add(3)

    const arr = toArray(set)

    expect(set).toBeIterable()
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('edge: delete', () => {
    const set = new SparseSet()
    set.add(1)

    set.delete(1)

    expect(set.has(1)).toBe(false)
  })
})
