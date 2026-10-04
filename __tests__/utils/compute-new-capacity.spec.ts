import { describe, test, expect } from 'vitest'
import { computeNewCapacity } from '@utils/compute-new-capacity.js'

describe('computeNewCapacity', () => {
  test('oldCapacity = targetLength', () => {
    const oldCapacity = 30
    const targetLength = 30
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(30)
  })

  test('oldCapactiy < targetLength', () => {
    const oldCapacity = 10
    const targetLength = 30
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(40)
  })

  describe('oldCapactiy > targetLength', () => {
    test('oldCapactiy / growthFactory > targetLength', () => {
      const oldCapacity = 80
      const targetLength = 30
      const growthFactory = 2

      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(40)
    })

    test('oldCapactiy / growthFactory < targetLength', () => {
      const oldCapacity = 50
      const targetLength = 30
      const growthFactory = 2

      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(50)
    })
  })

  test('edge: oldCapacity = 0', () => {
    const oldCapacity = 0
    const targetLength = 30
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(32)
  })

  test('edge: targetLength = 0', () => {
    const oldCapacity = 10
    const targetLength = 0
    const growthFactory = 2

    const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

    expect(result).toBe(0)
  })

  describe('edge: growthFactory = 1', () => {
    test('targetLength > oldCapacity', () => {
      const oldCapacity = 0
      const targetLength = 30
      const growthFactory = 1

      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(30)
    })

    test('targetLength < oldCapacity', () => {
      const oldCapacity = 30
      const targetLength = 0
      const growthFactory = 1

      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(0)
    })
  })

  describe('edge: growthFactory is a floating point number', () => {
    test('oldCapacity < targetLength', () => {
      const oldCapacity = 9
      const targetLength = 30
      const growthFactory = 1.5

      // 9 * 1.5 * 1.5 * 1.5 = 30.375
      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(30)
    })

    test('oldCapacity > targetLength', () => {
      const oldCapacity = 68
      const targetLength = 30
      const growthFactory = 1.5

      // 68 / 1.5 / 1.5 = 30.222222
      const result = computeNewCapacity(oldCapacity, targetLength, growthFactory)

      expect(result).toBe(30)
    })
  })
})
