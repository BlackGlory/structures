import { HashSet } from '@src/hash-set'

test('HashSet', () => {
  const set = new HashSet<object>(v => JSON.stringify(v))

  expect(Object.prototype.toString.call(set)).toBe('[object HashSet]')

  expect([...set]).toEqual([])

  set.add({ hello: 'world' })
  set.add({ hello: 'world' })
  expect(set.size).toBe(1)
  expect(set.has({ hello: 'world' })).toBeTruthy()

  set.clear()
  expect([...set.values()]).toEqual([])

  set.add({ hello: 'world' })
  expect(set.size).toBe(1)
  set.delete({ hello: 'world' })
  expect(set.size).toBe(0)
})
