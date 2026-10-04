import { UnsignedTypedArray, UnsignedTypedArrayConstructor } from 'justypes'

export function getMaxValueOfUnsignedTypedArrayConstructor(
  constructor: UnsignedTypedArrayConstructor
): number {
  switch (constructor) {
    case Uint8Array:
    case Uint8ClampedArray: return 255
    case Uint16Array: return 65535
    case Uint32Array: return 4294967295
    default: throw new Error('Unknown unsigned typed array')
  }
}

export function getMaxValueOfUnsignedTypedArray(array: UnsignedTypedArray): number {
  return getMaxValueOfUnsignedTypedArrayConstructor(
    array.constructor as UnsignedTypedArrayConstructor
  )
}
