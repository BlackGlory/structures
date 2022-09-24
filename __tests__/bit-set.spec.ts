import { toArray } from 'iterable-operator'
import { BitSet } from '@src/bit-set'
import { range } from 'extra-generator'
import '@blackglory/jest-matchers'

describe.each([8, 31])('BitSet(%s)', (bitsPerElement) => {
  test('create', () => {
    new BitSet(bitsPerElement)
  })

  describe('_dumpBinaryStrings', () => {
    test('empty', () => {
      const set = new BitSet(bitsPerElement)

      const result = set._dumpBinaryStrings()

      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(0)
      expect(result).toStrictEqual([])
    })

    test('non-empty', () => {
      const set = new BitSet(bitsPerElement)
      add()

      const result = set._dumpBinaryStrings()

      expect(result).toBeInstanceOf(Array)
      expect(result).toStrictEqual(getResult())

      function add(): void {
        switch (bitsPerElement) {
          case 8: {
            set.add(0)
            set.add(7)
            set.add(8)
            break
          }
          case 31: {
            set.add(0)
            set.add(30)
            set.add(31)
            break
          }
        }
      }

      function getResult(): string[] {
        switch (bitsPerElement) {
          case 8: return ['10000001', '00000001']
          case 31: return [
            '1' + '0'.repeat(29) + '1'
          , '0'.repeat(30) + '1'
          ]
          default: return []
        }
      }
    })
  })

  describe('size', () => {
    test('empty', () => {
      const set = new BitSet(bitsPerElement)

      const result = set.size

      expect(result).toBe(0)
    })

    test('non-emtpy', () => {
      const set = new BitSet(bitsPerElement)
      set.add(2)

      const result = set.size

      expect(result).toBe(1)
    })
  })

  test('[Symbol.iterator]', () => {
    const set = new BitSet(bitsPerElement)
    set.add(1)
    set.add(8)
    set.add(7)

    const result = set[Symbol.iterator]()
    const arrResult = toArray(result)

    expect(result).toBeIterable()
    expect(arrResult).toStrictEqual([1, 7, 8])
  })

  describe('values', () => {
    test('yield values in order', () => {
      const set = new BitSet(bitsPerElement)
      set.add(1)
      set.add(8)
      set.add(7)
      set.add(6)
      set.delete(6)

      const result = set.values()
      const arrResult = toArray(result)

      expect(result).toBeIterable()
      expect(arrResult).toStrictEqual([1, 7, 8])
    })

    test('edge: correctness in the case of lots of data', () => {
      const set = new BitSet(bitsPerElement)

      for (let i = 0; i < 1000; i++) {
        expect(toArray(set.values())).toStrictEqual(toArray(range(0, i)))
        set.add(i)
        expect(toArray(set.values())).toStrictEqual(toArray(range(0, i + 1)))
      }
    })

    test('edge: correctness in the case there are elements deleted', () => {
      const set = new BitSet(bitsPerElement)
      for (let i = 0; i < 1000; i++) {
        set.add(i)
      }

      for (let i = 1000; i--;) {
        expect(toArray(set.values())).toStrictEqual(toArray(range(0, i + 1)))
        set.delete(i)
        expect(toArray(set.values())).toStrictEqual(toArray(range(0, i)))
      }
    })
  })

  describe('has', () => {
    test('exists', () => {
      const set = new BitSet(bitsPerElement)
      set.add(1)

      const result = set.has(1)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const set = new BitSet(bitsPerElement)

      const result = set.has(1)

      expect(result).toBe(false)
    })

    test('edge: correctness in the case of lots of data', () => {
      const set = new BitSet(bitsPerElement)

      for (let i = 0; i < 1000; i++) {
        expect(set.has(i)).toBe(false)
        set.add(i)
        expect(set.has(i)).toBe(true)
      }
    })

    test('edge: correctness in the case there are elements deleted', () => {
      const set = new BitSet(bitsPerElement)

      for (let i = 0; i < 1000; i++) {
        set.add(i)
      }

      for (let i = 1000; i--;) {
        expect(set.has(i)).toBe(true)
        set.delete(i)
        expect(set.has(i)).toBe(false)
      }
    })
  })

  describe('add', () => {
    test('does not exist', () => {
      const set = new BitSet(bitsPerElement)

      const result = set.add(1)

      expect(result).toBe(true)
      expect(set.has(1)).toBe(true)
      expect(set.has(2)).toBe(false)
    })

    test('exists', () => {
      const set = new BitSet(bitsPerElement)
      set.add(1)

      const result = set.add(1)

      expect(result).toBe(false)
      expect(set.has(1)).toBe(true)
      expect(set.has(2)).toBe(false)
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const set = new BitSet(bitsPerElement)
      set.add(1)
      set.add(2)

      const result = set.delete(1)

      expect(result).toBe(true)
      expect(set.has(1)).toBe(false)
      expect(set.has(2)).toBe(true)
      expect(set.size).toBe(1)
    })

    test('does not exist', () => {
      const set = new BitSet(bitsPerElement)

      const result = set.delete(1)

      expect(result).toBe(false)
      expect(set.has(1)).toBe(false)
      expect(set.size).toBe(0)
    })
  })

  test('clear', () => {
    const set = new BitSet(bitsPerElement)
    set.add(1)
    set.add(2)

    set.clear()

    expect(set.has(1)).toBe(false)
    expect(set.has(2)).toBe(false)
  })
})
