export function sliceArrayLeft<T>(arr: T[], num: number): T[] {
  return arr.slice(0, num)
}

export function sliceArrayRight<T>(arr: T[], num: number): T[] {
  const startIndex = arr.length - num
  return arr.slice(startIndex >= 0 ? startIndex : 0)
}

export function truncateArrayLeft<T>(arr: T[], num: number): void {
  if (arr.length > num) {
    arr.length = num
  }
}

export function truncateArrayRight<T>(arr: T[], num: number): void {
  const startIndex = arr.length - num
  arr.splice(0, startIndex)
}
