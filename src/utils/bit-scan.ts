const mod37BitPositions: number[] = [
  32, 0, 1, 26, 2, 23, 27, 0, 3, 16
, 24, 30, 28, 11, 0, 13, 4, 7, 17, 0
, 25, 22, 31, 15, 29, 10, 12, 6, 0, 21
, 14, 9, 5, 20, 8, 19, 18
]

// http://graphics.stanford.edu/~seander/bithacks.html#ZerosOnRightModLookup
export function bitScan(value: number): number {
  return mod37BitPositions[(-value & value) % 37]
}
