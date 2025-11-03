import { zip, toArray, map } from 'iterable-operator'
import { isntUndefined } from 'extra-utils'

class TrieNode<T, U> {
  children = new Map<T, TrieNode<T, U>>()

  constructor(public value?: U) {}
}

export class TrieMap<K extends Iterable<T>, V, T = unknown> {
  private root = new TrieNode<T, V>()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  * entries(): IterableIterator<[key: T[], value: V]> {
    yield* dfs(this.root, [])

    function* dfs(node: TrieNode<T, V>, path: T[]): IterableIterator<[key: T[], value: V]> {
      for (const [subPath, childNode] of node.children) {
        const newPath = [...path, subPath]
        if (isntUndefined(childNode.value)) {
          yield [newPath, childNode.value]
        }

        yield* dfs(childNode, newPath)
      }
    }
  }

  keys(): IterableIterator<T[]> {
    return map(this.entries(), ([key]) => key)
  }

  values(): IterableIterator<V> {
    return map(this.entries(), ([, value]) => value)
  }

  set(key: K, value: V): this {
    let node = this.root
    for (const unitOfKey of key) {
      if (!node.children.has(unitOfKey)) {
        node.children.set(unitOfKey, new TrieNode<T, V>())
      }
      node = node.children.get(unitOfKey)!
    }

    node.value = value
    return this
  }

  has(key: K): boolean {
    let node = this.root
    for (const unitOfKey of key) {
      if (node.children.has(unitOfKey)) {
        node = node.children.get(unitOfKey)!
      } else {
        return false
      }
    }

    return node.value !== undefined
  }

  get(key: K): V | undefined {
    let node = this.root
    for (const unitOfKey of key) {
      if (node.children.has(unitOfKey)) {
        node = node.children.get(unitOfKey)!
      } else {
        return undefined
      }
    }

    return node.value
  }

  delete(key: K): boolean {
    const parentNodes: TrieNode<T, V>[] = []
    let node = this.root
    for (const unitOfKey of key) {
      if (node.children.has(unitOfKey)) {
        parentNodes.push(node)
        node = node.children.get(unitOfKey)!
      } else {
        return false
      }
    }

    node.value = undefined

    // 如果节点没有后缀, 则代表这是末端节点, 往前删除其前缀
    if (node.children.size === 0) {
      for (const [unitOfKey, parentNode] of toArray(zip(key, parentNodes)).reverse()) {
        parentNode.children.delete(unitOfKey)
        if (parentNode.children.size !== 0) break
      }
    }
    return true
  }
}
