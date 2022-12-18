import { SkipList, SkipListNode } from '@utils/skip-list'
import { toArray } from 'iterable-operator'

describe('SkipList', () => {
  test('create', () => {
    new SkipList<number>((a, b) => a - b)
  })

  describe('size', () => {
    test('empty', () => {
      const list = new SkipList<number>((a, b) => a - b)

      const result = list.size

      expect(result).toBe(0)
    })

    test('non-empty', () => {
      const list = new SkipList<number>((a, b) => a - b)
      list.add(1)
      list.add(2)

      const result = list.size

      expect(result).toBe(2)
    })
  })

  describe('elements', () => {
    test('non-empty', () => {
      const list = new SkipList<number>((a, b) => a - b)
      list.add(3)
      list.add(1)
      list.add(2)

      const iter = list.elements()
      const result = toArray(iter)

      expect(result).toHaveLength(3)
      expect(result[0].value).toBe(1)
      expect(result[1].value).toBe(2)
      expect(result[2].value).toBe(3)
    })

    test('empty', () => {
      const list = new SkipList<number>((a, b) => a - b)

      const iter = list.elements()
      const result = toArray(iter)

      expect(result).toStrictEqual([])
    })
  })

  describe('dumpList', () => {
    test('non-empty', () => {
      const list = new SkipList<number>((a, b) => a - b)
      list.add(1)
      list.add(2)

      const result = list.dumpList()

      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThanOrEqual(1)
      expect(result[result.length - 1]).toStrictEqual([null, 1, 2, null])
    })

    test('empty', () => {
      const list = new SkipList<number>((a, b) => a - b)

      const result = list.dumpList()

      expect(result).toBeInstanceOf(Array)
      expect(result.length).toBeGreaterThanOrEqual(1)
      expect(result[result.length - 1]).toStrictEqual([null, null])
    })
  })

  describe('delete', () => {
    test('exists', () => {
      const list = new SkipList<number>((a, b) => a - b)
      list.add(1)

      list.delete(1)

      expect(list.has(1)).toBe(false)
    })

    test('does not exist', () => {
      const list = new SkipList<number>((a, b) => a - b)

      list.delete(1)

      expect(list.has(1)).toBe(false)
    })
  })

  describe('findNode', () => {
    test('exists', () => {
      const list = new SkipList<number>((a, b) => a - b)
      list.add(1)

      const result = list.findNode(1)

      expect(result).toBeInstanceOf(SkipListNode)
      expect(result!.value).toBe(1)
    })

    test('does not exist', () => {
      const list = new SkipList<number>((a, b) => a - b)

      const result = list.findNode(1)

      expect(result).toBe(null)
    })
  })

  describe('has', () => {
    test('exists', () => {
      const list = new SkipList<number>((a, b) => a - b)
      list.add(1)

      const result = list.has(1)

      expect(result).toBe(true)
    })

    test('does not exist', () => {
      const list = new SkipList<number>((a, b) => a - b)

      const result = list.has(1)

      expect(result).toBe(false)
    })
  })

  describe('add', () => {
    test('new value', () => {
      const list = new SkipList<number>((a, b) => a - b)

      list.add(1)
      list.add(2)

      expect(list.size).toBe(2)
      expect(list.has(0)).toBe(false)
      expect(list.has(1)).toBe(true)
      expect(list.has(2)).toBe(true)
      expect(list.has(3)).toBe(false)
    })

    test('duplicate value', () => {
      const list = new SkipList<number>((a, b) => a - b)

      list.add(1)
      list.add(1)

      expect(list.size).toBe(1)
      expect(list.has(1)).toBe(true)
      expect(list.has(2)).toBe(false)
    })
  })
})
