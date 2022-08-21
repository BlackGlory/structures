import { SortedSet } from '@src/sorted-set'
import { toArray } from 'iterable-operator'
import '@blackglory/jest-matchers'

describe('SortedSet', () => {
  test('create', () => {
    new SortedSet(compareStringNumber)
  })

  test('has', () => {
    const set = new SortedSet(compareStringNumber)
    set.add('1')

    const result1 = set.has('1')
    const result2 = set.has('2')

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  test('add', () => {
    const set = new SortedSet(compareStringNumber)

    set.add('1')
    set.add('2')

    expect(set.has('0')).toBe(false)
    expect(set.has('1')).toBe(true)
    expect(set.has('2')).toBe(true)
  })

  test('delete', () => {
    const set = new SortedSet(compareStringNumber)
    set.add('1')
    set.add('2')

    set.delete('1')

    expect(set.has('1')).toBe(false)
    expect(set.has('2')).toBe(true)
  })

  describe('[Symbol.iterator]', () => {
    test('non-empty', () => {
      const set = new SortedSet(compareStringNumber)

      const arr = toArray(set)

      expect(set).toBeIterable()
      expect(arr).toStrictEqual([])
    })

    test('non-empty', () => {
      const set = new SortedSet(compareStringNumber)
      set.add('1')
      set.add('2')
      set.add('3')

      const arr = toArray(set)

      expect(set).toBeIterable()
      expect(arr).toStrictEqual(['1', '2', '3'])
    })
  })

  describe('values', () => {
    test('empty', () => {
      const set = new SortedSet(compareStringNumber)

      const result = set.values()
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toStrictEqual([])
    })

    test('non-empty', () => {
      const set = new SortedSet(compareStringNumber)
      set.add('3')
      set.add('1')
      set.add('2')

      const result = set.values()
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toStrictEqual(['1', '2', '3'])
    })
  })
})

function compareStringNumber(a: string, b: string): number {
  return Number(a) - Number(b)
}
