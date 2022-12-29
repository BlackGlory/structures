import { SparseMap } from '@src/sparse-map'
import { toArray } from 'iterable-operator'

describe('SparseMap', () => {
  describe('size', () => {
    test('empty', () => {
      const map = new SparseMap()

      const result = map.size

      expect(result).toBe(0)
    })

    describe('non-empty', () => {
      test('set', () => {
        const map = new SparseMap()
        map.set(1, '1')

        const result = map.size

        expect(result).toBe(1)
      })

      test('delete', () => {
        const map = new SparseMap()
        map.set(1, '1')
        map.delete(1)

        const result = map.size

        expect(result).toBe(0)
      })
    })
  })

  test('internalArray', () => {
    const map = new SparseMap()
    map.set(1, 1)

    const internalArr = map.internalArray
    const result1 = internalArr[0]
    internalArr[0] = 2
    const result2 = map.get(1)

    expect(internalArr).toBeInstanceOf(Array)
    expect(result1).toBe(1)
    expect(result2).toBe(2)
  })

  test('has', () => {
    const map = new SparseMap()
    map.set(1, '1')

    const result1 = map.has(1)
    const result2 = map.has(2)

    expect(result1).toBe(true)
    expect(result2).toBe(false)
  })

  describe('get', () => {
    test('exists', () => {
      const map = new SparseMap()
      map.set(1, '1')

      const result = map.get(1)

      expect(result).toBe('1')
    })

    test('does not exist', () => {
      const map = new SparseMap()

      const result = map.get(1)

      expect(result).toBe(undefined)
    })

    test('edge: deleted key', () => {
      const map = new SparseMap()
      map.set(1, '1')
      map.delete(1)

      const result = map.get(1)

      expect(result).toBe(undefined)
    })

    test('edge: reused key', () => {
      const map = new SparseMap()
      map.set(1, '1')
      map.delete(1)
      map.set(1, '2')

      const result = map.get(1)

      expect(result).toBe('2')
    })

    test('edge: reused key with length growth', () => {
      const map = new SparseMap()
      map.set(0, '0')
      map.set(1, '1')
      map.delete(0)
      map.set(0, '2')
      map.set(2, '3')

      const result1 = map.get(0)
      const result2 = map.get(1)
      const result3 = map.get(2)

      expect(result1).toBe('2')
      expect(result2).toBe('1')
      expect(result3).toBe('3')
    })
  })

  test('set', () => {
    const map = new SparseMap()

    map.set(1, '1')
    map.set(2, '2')

    expect(map.has(0)).toBe(false)
    expect(map.has(1)).toBe(true)
    expect(map.has(2)).toBe(true)
  })

  describe('delete', () => {
    test('not last item', () => {
      const map = new SparseMap()
      map.set(1, '1')
      map.set(2, '2')

      map.delete(1)

      expect(map.has(1)).toBe(false)
      expect(map.has(2)).toBe(true)
    })

    test('last item', () => {
      const set = new SparseMap()
      set.set(1, '1')

      set.delete(1)

      expect(set.has(1)).toBe(false)
    })
  })

  test('clear', () => {
    const map = new SparseMap()
    map.set(1, '1')

    map.clear()

    expect(map.has(1)).toBe(false)
  })

  test('entries', () => {
    const set = new SparseMap()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const iter = set.entries()
    const result = toArray(iter)

    expect(result).toStrictEqual([
      [1, '1']
    , [2, '2']
    , [3, '3']
    ])
  })

  test('keys', () => {
    const set = new SparseMap()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const iter = set.keys()
    const result = toArray(iter)

    expect(result).toStrictEqual([1, 2, 3])
  })

  test('values', () => {
    const set = new SparseMap()
    set.set(1, '1')
    set.set(2, '2')
    set.set(3, '3')

    const iter = set.values()
    const result = toArray(iter)

    expect(result).toStrictEqual(['1', '2', '3'])
  })

  test('getInternalIndexOfKey', () => {
    const set = new SparseMap()
    set.set(3, 30)
    set.set(1, 10)
    set.set(2, 20)

    const result1 = set.getInternalIndexOfKey(1) // 1
    const result2 = set.getInternalIndexOfKey(2) // 2
    const result3 = set.getInternalIndexOfKey(3) // 0

    expect(result1).toBe(1)
    expect(result2).toBe(2)
    expect(result3).toBe(0)
    expect(set.internalArray[result1!]).toBe(10)
    expect(set.internalArray[result2!]).toBe(20)
    expect(set.internalArray[result3!]).toBe(30)
  })
})
