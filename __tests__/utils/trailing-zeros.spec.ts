import { trailingZeros } from '@utils/trailing-zeros.js'

describe('trailingZeros', () => {
  test('found', () => {
    const result1 = trailingZeros(0b00000001)
    const result2 = trailingZeros(0b00000010)

    expect(result1).toBe(0)
    expect(result2).toBe(1)
  })

  test('not found', () => {
    const result = trailingZeros(0b00000000)

    expect(result).toBe(32)
  })
})
