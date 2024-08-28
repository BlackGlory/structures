import { DisjointSet } from '@src/disjoint-set.js'
import { getError } from 'return-style'

describe('DisjointSet', () => {
  describe('makeSet', () => {
    test('general', () => {
      const set = new DisjointSet()

      set.makeSet(0)
      set.makeSet(1)

      expect(set.find(0)).not.toBe(set.find(1))
    })

    test('edge: The value already belongs to a set', () => {
      const set = new DisjointSet()
      set.makeSet(0)

      const err = getError(() => set.makeSet(0))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('union', () => {
    test('general', () => {
      const set = new DisjointSet()
      set.makeSet(0)
      set.makeSet(1)
      set.makeSet(2)
      set.makeSet(3)

      set.union(0, 1)
      set.union(0, 2)

      expect(set.find(0)).toBe(set.find(1))
      expect(set.find(0)).toBe(set.find(2))
      expect(set.find(0)).not.toBe(set.find(3))
      expect(set.find(1)).toBe(set.find(2))
      expect(set.find(1)).not.toBe(set.find(3))
      expect(set.find(2)).not.toBe(set.find(3))
    })

    test('edge: value does not belong to any set', () => {
      const set = new DisjointSet()

      const err = getError(() => set.union(0, 1))

      expect(err).toBeInstanceOf(Error)
    })
  })

  describe('find', () => {
    test('diff set', () => {
      const set = new DisjointSet()
      set.makeSet(0)
      set.makeSet(1)

      const a = set.find(0)
      const b = set.find(1)

      expect(a).not.toBe(b)
    })

    describe('same set', () => {
      test('direct', () => {
        const set = new DisjointSet()
        set.makeSet(0)
        set.makeSet(1)
        set.union(0, 1)

        const a = set.find(0)
        const b = set.find(1)

        expect(a).toBe(b)
      })

      test('indirect', () => {
        const set = new DisjointSet()
        set.makeSet(0)
        set.makeSet(1)
        set.makeSet(2)
        set.union(0, 1)
        set.union(0, 2)

        const a = set.find(1)
        const b = set.find(2)

        expect(a).toBe(b)
      })
    })

    test('edge: value does not belong to any set', () => {
      const set = new DisjointSet()

      const err = getError(() => set.find(0))

      expect(err).toBeInstanceOf(Error)
    })
  })
})
