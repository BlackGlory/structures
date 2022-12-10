import { isNull } from 'extra-utils'
import { Cons } from 'justypes'
export { Cons } from 'justypes'

export function convertConsToArray<T>([value, next]: Cons<T>): T[] {
  if (isNull(next)) {
    return [value]
  } else {
    return [value, ...convertConsToArray(next)]
  }
}

export function convertArrayToCons<T>([value, ...next]: T[]): Cons<T> {
  return [value, next.length ? convertArrayToCons(next) : null]
}
