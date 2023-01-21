import { SkipList } from '@utils/skip-list.js'
import { map } from 'iterable-operator'

export class SortedSet<T> implements Iterable<T> {
  private skipList: SkipList<T>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values()
  }

  constructor(compare: (a: T, b: T) => number) {
    this.skipList = new SkipList(compare)
  }

  values(): IterableIterator<T> {
    return map(this.skipList.elements(), node => node.value!)
  }

  has(value: T): boolean {
    return this.skipList.has(value)
  }

  add(value: T): void {
    this.skipList.add(value)
  }

  delete(value: T): void {
    this.skipList.delete(value)
  }
}
