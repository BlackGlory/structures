import { assert } from '@blackglory/errors'
import { isntUndefined } from 'extra-utils'

export class DisjointSet {
  private parent: number[] = []
  private rank: number[] = []

  has(value: number): boolean {
    return isntUndefined(this.parent[value])
  }

  sets(): number[][] {
    const results: number[][] = []
    for (let i = 0, len = this.parent.length; i < len; i++) {
      if (this.has(i)) {
        const set = this.find(i)
        if (!results[set]) {
          results[set] = []
        }
        results[set].push(i)
      }
    }
    return results.filter(isntUndefined)
  }

  makeSet(value: number): number {
    assert(!this.has(value), 'The value already belongs to a set')

    this.parent[value] = value
    this.rank[value] = 0

    return value
  }

  union(a: number, b: number): void {
    const aRoot = this.find(a)
    const bRoot = this.find(b)

    if (aRoot === bRoot) return

    const aRootRank = this.rank[aRoot]
    const bRootRank = this.rank[bRoot]

    if (aRootRank === bRootRank) {
      this.parent[aRoot] = bRoot
      this.rank[bRoot]++
    } else if (aRootRank < bRootRank) {
      this.parent[aRoot] = bRoot
    } else {
      this.parent[bRoot] = aRoot
    }
  }

  find(value: number): number {
    const nodeValue = this.parent[value]
    assert(isntUndefined(nodeValue), 'The value does not belong to any set')
    if (nodeValue === value) return value

    const parentNode = nodeValue
    const root = this.find(parentNode)
    this.parent[value] = root
    return root
  }
}
