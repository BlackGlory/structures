import { describe, test, expect } from 'vitest'
import { getMaxValueOfUnsignedTypedArray, getMaxValueOfUnsignedTypedArrayConstructor } from '@utils/get-max-value-of-unsigned-typed-array.js'
import { UnsignedTypedArrayConstructor } from 'justypes'

describe(`getMaxValueOfUnsignedTypedArray`, () => {
  test.each([
    [Uint8Array.name, Uint8Array]
  , [Uint8ClampedArray.name, Uint8ClampedArray]
  , [Uint16Array.name, Uint16Array]
  , [Uint32Array.name, Uint32Array]
  ])('%s', (_, UintArray) => {
    const typedArray = new UintArray()

    const result = getMaxValueOfUnsignedTypedArray(typedArray)

    expect(result).toBe(getMaxValueOfUnsignedTypedArrayConstructorSlow(UintArray))
  })
})

describe('getMaxValueOfUnsignedTypedArrayConstructor', () => {
  test.each([
    [Uint8Array.name, Uint8Array]
  , [Uint8ClampedArray.name, Uint8ClampedArray]
  , [Uint16Array.name, Uint16Array]
  , [Uint32Array.name, Uint32Array]
  ])('%s', (_, UintArray) => {
    const typedArrayConstructor = UintArray

    const result = getMaxValueOfUnsignedTypedArrayConstructor(typedArrayConstructor)

    expect(result).toBe(getMaxValueOfUnsignedTypedArrayConstructorSlow(UintArray))
  })
})

function getMaxValueOfUnsignedTypedArrayConstructorSlow(
  constructor: UnsignedTypedArrayConstructor
): number {
  // Uint8ClampedArray具有自动clamp的特殊性, 因此替换为Uint8Array.
  if (constructor === Uint8ClampedArray) constructor = Uint8Array

  // 由于无符号类型数组不支持负值, `-1`的补码表示会被截断为全`1`, 等同于最大值.
  const unsignedTypedArray = new constructor([-1])

  return unsignedTypedArray[0]
}
