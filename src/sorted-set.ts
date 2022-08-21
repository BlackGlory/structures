import { SkipList } from '@utils/skip-list'
import { map } from 'iterable-operator'

export class SortedSet<T> implements Iterable<T> {
  private skipList: SkipList<T>

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  * [Symbol.iterator](): IterableIterator<T> {
    for (const value of this.values()) {
      yield value
    }
  }

  constructor(compare: (a: T, b: T) => number) {
    this.skipList = new SkipList(compare)
  }

  values(): Iterable<T> {
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
