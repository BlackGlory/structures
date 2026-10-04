import { describe, test, expect } from 'vitest'
import { trailingZeros } from '@utils/trailing-zeros.js'

describe('trailingZeros', () => {
  test('general', () => {
    const result1 = trailingZeros(0b00000000)
    const result2 = trailingZeros(0b00000001)
    const result3 = trailingZeros(0b00000010)

    expect(result1).toBe(32)
    expect(result2).toBe(0)
    expect(result3).toBe(1)
  })

  test('edge: -(2^31)', () => {
    const result1 = trailingZeros(-(2 ** 31))
    // 补码表示: 10000000 00000000 00000000 00000000

    expect(result1).toBe(31)
  })
})
