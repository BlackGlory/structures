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
      for (const [char, childNode] of node.children) {
        const newPath = path + char
        if (isntUndefined(childNode.value)) {
          yield [newPath, childNode.value]
        }

        yield* dfs(childNode, newPath)
      }
    }
  }

  keys(): IterableIterator<string> {
    return map(this.entries(), ([key]) => key)
  }

  values(): IterableIterator<T> {
    return map(this.entries(), ([, value]) => value)
  }

  set(key: string, value: T): this {
    let node = this.root
    for (const char of key) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode<T>())
      }
      node = node.children.get(char)!
    }

    node.value = value
    return this
  }

  has(key: string): boolean {
    let node = this.root
    for (const char of key) {
      if (node.children.has(char)) {
        node = node.children.get(char)!
      } else {
        return false
      }
    }

    return node.value !== undefined
  }

  get(key: string): T | undefined {
    let node = this.root
    for (const char of key) {
      if (node.children.has(char)) {
        node = node.children.get(char)!
      } else {
        return undefined
      }
    }

    return node.value
  }

  delete(key: string): boolean {
    const parentNodes: TrieNode<T>[] = []
    let node = this.root
    for (const char of key) {
      if (node.children.has(char)) {
        parentNodes.push(node)
        node = node.children.get(char)!
      } else {
        return false
      }
    }

    node.value = undefined

    // 如果节点没有后缀, 则代表这是末端节点, 往前删除其前缀
    if (node.children.size === 0) {
      for (const [char, parentNode] of toArray(zip(key, parentNodes)).reverse()) {
        parentNode.children.delete(char)
        if (parentNode.children.size !== 0) break
      }
    }
    return true
  }
}
