import {
  sliceArrayLeft
, sliceArrayRight
, truncateArrayLeft
, truncateArrayRight
} from '@src/array.js'

describe('sliceArrayLeft', () => {
  test('num < length', () => {
    const arr = [1, 2, 3]

    const result = sliceArrayLeft(arr, 2)

    expect(result).toStrictEqual([1, 2])
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('num = length', () => {
    const arr = [1, 2, 3]

    const result = sliceArrayLeft(arr, 3)

    expect(result).not.toBe(arr)
    expect(result).toStrictEqual([1, 2, 3])
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('num > length', () => {
    const arr = [1, 2, 3]

    const result = sliceArrayLeft(arr, 4)

    expect(result).not.toBe(arr)
    expect(result).toStrictEqual([1, 2, 3])
    expect(arr).toStrictEqual([1, 2, 3])
  })
})

describe('sliceArrayRight', () => {
  test('num < length', () => {
    const arr = [1, 2, 3]

    const result = sliceArrayRight(arr, 2)

    expect(result).toStrictEqual([2, 3])
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('num = length', () => {
    const arr = [1, 2, 3]

    const result = sliceArrayRight(arr, 3)

    expect(result).not.toBe(arr)
    expect(result).toStrictEqual([1, 2, 3])
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('num > length', () => {
    const arr = [1, 2, 3]

    const result = sliceArrayRight(arr, 4)

    expect(result).not.toBe(arr)
    expect(result).toStrictEqual([1, 2, 3])
    expect(arr).toStrictEqual([1, 2, 3])
  })
})

describe('truncateArrayLeft', () => {
  test('num < length', () => {
    const arr = [1, 2, 3]

    const result = truncateArrayLeft(arr, 2)

    expect(result).toBe(undefined)
    expect(arr).toStrictEqual([1, 2])
  })

  test('num = length', () => {
    const arr = [1, 2, 3]

    const result = truncateArrayLeft(arr, 3)

    expect(result).toBe(undefined)
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('num > length', () => {
    const arr = [1, 2, 3]

    const result = truncateArrayLeft(arr, 4)

    expect(result).toBe(undefined)
    expect(arr).toStrictEqual([1, 2, 3])
  })
})

describe('truncateArrayRight', () => {
  test('num < length', () => {
    const arr = [1, 2, 3]

    const result = truncateArrayRight(arr, 2)

    expect(result).toBe(undefined)
    expect(arr).toStrictEqual([2, 3])
  })

  test('num = length', () => {
    const arr = [1, 2, 3]

    const result = truncateArrayRight(arr, 3)

    expect(result).toBe(undefined)
    expect(arr).toStrictEqual([1, 2, 3])
  })

  test('num > length', () => {
    const arr = [1, 2, 3]

    const result = truncateArrayRight(arr, 4)

    expect(result).toBe(undefined)
    expect(arr).toStrictEqual([1, 2, 3])
  })
})
