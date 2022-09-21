import { bitScan } from '@utils/bit-scan'

describe('bitscan', () => {
  test('not found', () => {
    const result = bitScan(0b00000000)

    expect(result).toBe(32)
  })

  test('found', () => {
    const result1 = bitScan(0b00000001)
    const result2 = bitScan(0b00000010)

    expect(result1).toBe(0)
    expect(result2).toBe(1)
  })
})
