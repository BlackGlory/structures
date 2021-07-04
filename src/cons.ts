import { Cons } from 'justypes'
export { Cons } from 'justypes'

export function convertConsToArray<T>([value, next]: Cons<T>): T[] {
  if (next === null) return [value]
  return [value, ...convertConsToArray(next)]
}

export function convertArrayToCons<T>([value, ...next]: T[]): Cons<T> {
  return [value, next.length ? convertArrayToCons(next) : null]
}
