import { describe, test, expect } from 'vitest'
import { toArray } from 'iterable-operator'
import { TypedBitSet } from '@bit-set/typed-bit-set.js'
import { range } from 'extra-generator'

describe.each([
  ['Uint8Array', Uint8Array]
, ['Uint16Array', Uint16Array]
, ['Uint32Array', Uint32Array]
])('TypedBitSet(%s)', (_, UintArray) => {
  describe('_dumpBinaryStrings', () => {
    test('empty', () => {
      const set = new TypedBitSet(new UintArray())

      const result = set._dumpBinaryStrings()

      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(0)
      expect(result).toStrictEqual([])
    })

    test('non-empty', () => {
      const set = new TypedBitSet(new UintArray(2))
      add()

      const result = set._dumpBinaryStrings()

      expect(result).toBeInstanceOf(Array)
      expect(result).toStrictEqual(getExpectedResult())

      function add(): void {
        switch (UintArray) {
          case Uint8Array: {
            set.add(0)
            set.add(7)
            set.add(8)
            break
          }
          case Uint16Array: {
            set.add(0)
            set.add(15)
            set.add(16)
            break
          }
          case Uint32Array: {
            set.add(0)
            set.add(31)
            set.add(32)
            break
          }
        }
      }

      function getExpectedResult(): string[] {
        switch (UintArray) {
          case Uint8Array: {
            return [
              '10000001'
            , '00000001'
            ]
          }
          case Uint16Array: {
            return [
              '1' + '0'.repeat(14) + '1'
            , '0'.repeat(15) + '1'
            ]
          }
          case Uint32Array: {
            return [
              '1' + '0'.repeat(30) + '1'
            , '0'.repeat(31) + '1'
            ]
          }
          default: return []
        }
      }
    })
  })

  describe('size', () => {
    test('empty', () => {
      const set = new TypedBitSet(new UintArray(100))

      const result = set.size

      expect(result).toBe(0)
    })

    test('non-emtpy', () => {
      const set = new TypedBitSet(new UintArray(100))
      set.add(2)

      const result = set.size

      expect(result).toBe(1)
    })
  })

  describe('capacity', () => {
    test('non-resizable', () => {
      const set = new TypedBitSet(new UintArray(100))

      const result = set.capacity

      expect(result).toBe(100 * UintArray.BYTES_PER_ELEMENT * 8)
    })

    test('resizable', () => {
      const buffer = new ArrayBuffer(
        100 * UintArray.BYTES_PER_ELEMENT
      , { maxByteLength: 200 * UintArray.BYTES_PER_ELEMENT }
      )
      const set = new TypedBitSet(new UintArray(buffer))

      const result1 = set.capacity
      buffer.resize(200 * UintArray.BYTES_PER_ELEMENT)
      const result2 = set.capacity

      expect(result1).toBe(100 * UintArray.BYTES_PER_ELEMENT * 8)
      expect(result2).toBe(200 * UintArray.BYTES_PER_ELEMENT * 8)
    })
  })

  test('[Symbol.iterator]', () => {
    const set = new TypedBitSet(new UintArray(100))
    set.add(1)
    set.add(8)
    set.add(7)

    const iter = set[Symbol.iterator]()
    const result = toArray(iter)

    expect(result).toStrictEqual([1, 7, 8])
  })

  describe('values', () => {
    test('yield values in order', () => {
      const set = new TypedBitSet(new UintArray(100))
      set.add(1)
      set.add(8)
      set.add(7)
      set.add(6)
      set.delete(6)

      const iter = set.values()
      const result = toArray(iter)

      expect(result).toStrictEqual([1, 7, 8])
    })

    test('edge: correctness in the case of lots of data', () => {
      const set = new TypedBitSet(new UintArray(1000))

      for (let i = 0; i < 1000; i++) {
        expect(toArray(set.values())).toStrictEqual(toArray(range(0, i)))
        set.add(i)
        expect(toArray(set.values())).toStrictEqual(toArray(range(0, i + 1)))
      }
    })

    test('edge: correctness in the case there are elements deleted', () => {
      const set = new TypedBitSet(new UintArray(1000))
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
      const set = new TypedBitSet(new UintArray(100))
      set.add(1)

      const result = set.has(1)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const set = new TypedBitSet(new UintArray(100))

      const result = set.has(1)

      expect(result).toBe(false)
    })

    test('edge: correctness in the case of lots of data', () => {
      const set = new TypedBitSet(new UintArray(1000))

      for (let i = 0; i < 1000; i++) {
        expect(set.has(i)).toBe(false)
        set.add(i)
        expect(set.has(i)).toBe(true)
      }
    })

    test('edge: correctness in the case there are elements deleted', () => {
      const set = new TypedBitSet(new UintArray(1000))
      for (let i = 0; i < 1000; i++) {
        set.add(i)
      }

      for (let i = 0; i < 1000; i++) {
        expect(set.has(i)).toBe(true)
        set.delete(i)
        expect(set.has(i)).toBe(false)
      }
    })
  })

  describe('add', () => {
    test('does not exist', () => {
      const set = new TypedBitSet(new UintArray(100))

      const result = set.add(1)

      expect(result).toBe(true)
      expect(set.size).toBe(1)
      expect(set.has(1)).toBe(true)
      expect(set.has(2)).toBe(false)
    })

    test('exists', () => {
      const set = new TypedBitSet(new UintArray(100))
      set.add(1)

      const result = set.add(1)

      expect(result).toBe(false)
      expect(set.size).toBe(1)
      expect(set.has(1)).toBe(true)
      expect(set.has(2)).toBe(false)
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const set = new TypedBitSet(new UintArray(100))
      set.add(1)
      set.add(2)

      const result = set.delete(1)

      expect(result).toBe(true)
      expect(set.size).toBe(1)
      expect(set.has(1)).toBe(false)
      expect(set.has(2)).toBe(true)
      expect(set.size).toBe(1)
    })

    test('does not exist', () => {
      const set = new TypedBitSet(new UintArray(100))

      const result = set.delete(1)

      expect(result).toBe(false)
      expect(set.size).toBe(0)
      expect(set.has(1)).toBe(false)
      expect(set.size).toBe(0)
    })
  })

  test('clear', () => {
    const set = new TypedBitSet(new UintArray(100))
    set.add(1)
    set.add(2)

    set.clear()

    expect(set.size).toBe(0)
    expect(set.has(1)).toBe(false)
    expect(set.has(2)).toBe(false)
  })
})
