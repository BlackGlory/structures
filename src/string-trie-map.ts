import { zip, toArray, map } from 'iterable-operator'
import { isntUndefined } from 'extra-utils'

class TrieNode<T> {
  children = new Map<string, TrieNode<T>>()

  constructor(public value?: T) {}
}

export class StringTrieMap<T> {
  private root = new TrieNode<T>()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  entries(): IterableIterator<[key: string, value: T]> {
    return dfs(this.root, '')

    function* dfs(node: TrieNode<T>, path: string): IterableIterator<[key: string, value: T]> {
      for (const [subPath, childNode] of node.children) {
        const newPaths = path + subPath
        if (isntUndefined(childNode.value)) {
          yield [newPaths, childNode.value]
        }

        yield* dfs(childNode, newPaths)
      }
    }
  }

  keys(): IterableIterator<string> {
    return map(this.entries(), ([key]) => key)
  }

  values(): IterableIterator<T> {
    return map(this.entries(), ([_, value]) => value)
  }

  set(key: string, value: T): this {
    let node = this.root
    for (const part of key) {
      if (!node.children.has(part)) {
        node.children.set(part, new TrieNode<T>())
      }
      node = node.children.get(part)!
    }

    node.value = value
    return this
  }

  has(key: string): boolean {
    let node = this.root
    for (const part of key) {
      if (node.children.has(part)) {
        node = node.children.get(part)!
      } else {
        return false
      }
    }

    return node.value !== undefined
  }

  get(key: string): T | undefined {
    let node = this.root
    for (const part of key) {
      if (node.children.has(part)) {
        node = node.children.get(part)!
      } else {
        return undefined
      }
    }

    return node.value
  }

  delete(key: string): boolean {
    const parentNodes: TrieNode<T>[] = []
    let node = this.root
    for (const part of key) {
      if (node.children.has(part)) {
        parentNodes.push(node)
        node = node.children.get(part)!
      } else {
        return false
      }
    }

    delete node.value

    // 如果节点没有后缀, 则代表这是末端节点, 往前删除其前缀
    if (node.children.size === 0) {
      for (const [part, parentNode] of toArray(zip(key, parentNodes)).reverse()) {
        parentNode.children.delete(part)
        if (parentNode.children.size !== 0) break
      }
    }
    return true
  }
}
