// http://graphics.stanford.edu/~seander/bithacks.html#ZerosOnRightModLookup
const mod37BitPositions: number[] = [
  32, 0, 1, 26, 2, 23, 27, 0, 3, 16
, 24, 30, 28, 11, 0, 13, 4, 7, 17, 0
, 25, 22, 31, 15, 29, 10, 12, 6, 0, 21
, 14, 9, 5, 20, 8, 19, 18
]

/**
 * 该函数在找不到结果时返回32, 与Rust内置函数的表现一致.
 * https://doc.rust-lang.org/std/primitive.u32.html#method.trailing_zeros
 */
export function trailingZeros(value: number): number {
  return mod37BitPositions[(-value & value) % 37]
}
