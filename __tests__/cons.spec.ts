import { Cons, convertArrayToCons, convertConsToArray } from '@src/cons'

test('convertConsToArray<T>(cons: Cons<T>): T[]', () => {
  const cons: Cons<number> = [1, [2, [3, null]]]

  const result = convertConsToArray(cons)

  expect(result).toStrictEqual([1, 2, 3])
})

test('convertArrayToCons<T>(arr: T[]): Cons<T>', () => {
  const arr = [1, 2, 3]

  const result = convertArrayToCons(arr)

  expect(result).toStrictEqual([1, [2, [3, null]]])
})
