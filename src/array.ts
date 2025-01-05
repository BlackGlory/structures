export function sliceArrayLeft<T>(arr: readonly T[], num: number): T[] {
  return arr.slice(0, num)
}

export function sliceArrayRight<T>(arr: readonly T[], num: number): T[] {
  const startIndex = arr.length - num
  return arr.slice(startIndex >= 0 ? startIndex : 0)
}

export function truncateArrayLeft(arr: unknown[], num: number): void {
  if (arr.length > num) {
    arr.length = num
  }
}

export function truncateArrayRight(arr: unknown[], num: number): void {
  const startIndex = arr.length - num
  arr.splice(0, startIndex)
}

export function clearArray(arr: unknown[]): void {
  arr.length = 0
}
