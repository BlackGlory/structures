import { Box } from '@src/box'

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
