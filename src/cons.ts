export type Cons<T> = [T, Cons<T>] | [T, null]

export function convertConsToArray<T>([value, next]: Cons<T>): T[] {
  if (next === null) return [value]
  return [value, ...convertConsToArray(next)]
}

export function convertArrayToCons<T>([value, ...next]: T[]): Cons<T> {
  return [value, next.length ? convertArrayToCons(next) : null]
}
