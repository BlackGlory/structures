import { toArray } from 'iterable-operator'
import { TypedBitSet } from '@src/typed-bit-set'
import { DynamicTypedArray } from '@src/dynamic-typed-array'
import '@blackglory/jest-matchers'

describe('TypedBitSet', () => {
  test('create', () => {
    new TypedBitSet(new DynamicTypedArray(Uint8Array))
  })

  describe('_dumpBinaryStrings', () => {
    test('empty', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))

      const result = set._dumpBinaryStrings()

      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(0)
      expect(result).toStrictEqual([])
    })

    test('non-empty', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
      set.add(0)
      set.add(7)
      set.add(8)

      const result = set._dumpBinaryStrings()

      expect(result).toBeInstanceOf(Array)
      expect(result).toHaveLength(2)
      expect(result).toStrictEqual(['10000001', '00000001'])
    })
  })

  describe('size', () => {
    test('empty', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))

      const result = set.size

      expect(result).toBe(0)
    })

    test('non-emtpy', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
      set.add(2)

      const result = set.size

      expect(result).toBe(3) // [0, 1, 2]
    })
  })

  test('[Symbol.iterator]', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
    set.add(1)
    set.add(8)
    set.add(7)

    const result = set[Symbol.iterator]()
    const arrResult = toArray(result)

    expect(result).toBeIterable()
    expect(arrResult).toStrictEqual([1, 7, 8])
  })

  test('values', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
    set.add(1)
    set.add(8)
    set.add(7)

    const result = set.values()
    const arrResult = toArray(result)

    expect(result).toBeIterable()
    expect(arrResult).toStrictEqual([1, 7, 8])
  })

  describe('has', () => {
    test('exists', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
      set.add(1)

      const result = set.has(1)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))

      const result = set.has(1)

      expect(result).toBe(false)
    })
  })

  describe('add', () => {
    test('does not exist', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))

      set.add(1)

      expect(set.has(1)).toBe(true)
      expect(set.has(2)).toBe(false)
    })

    test('exists', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
      set.add(1)

      set.add(1)

      expect(set.has(1)).toBe(true)
      expect(set.has(2)).toBe(false)
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
      set.add(1)
      set.add(2)

      const result = set.delete(1)

      expect(result).toBe(true)
      expect(set.has(1)).toBe(false)
      expect(set.has(2)).toBe(true)
    })

    test('does not exist', () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))

      const result = set.delete(1)

      expect(result).toBe(false)
      expect(set.has(1)).toBe(false)
    })
  })

  test('clear', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
    set.add(1)
    set.add(2)

    set.clear()

    expect(set.has(1)).toBe(false)
    expect(set.has(2)).toBe(false)
  })
})
