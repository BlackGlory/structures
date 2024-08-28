import { describe, test, expect } from 'vitest'
import { Box } from '@src/box.js'

describe('Box', () => {
  test('constructor', () => {
    const result = new Box(1)

    expect(result.get()).toBe(1)
  })

  test('set & get', () => {
    const result = new Box(1)

    result.set(2)

    expect(result.get()).toBe(2)
  })
})
