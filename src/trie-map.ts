import { zip, toArray } from 'iterable-operator'
import { UnpackedIterable } from 'justypes'

class TrieNode<T, U> {
  children = new Map<T, TrieNode<T, U>>()

  constructor(public value?: U) {}
}

export class TrieMap<K extends Iterable<T>, V, T = UnpackedIterable<K>> {
  private root = new TrieNode<T, V>()

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  set(key: K, value: V): this {
    let node = this.root
    for (const part of key) {
      if (!node.children.has(part)) {
        node.children.set(part, new TrieNode<T, V>())
      }
      node = node.children.get(part)!
    }

    node.value = value
    return this
  }

  has(key: K): boolean {
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

  get(key: K): V | undefined {
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

  delete(key: K): boolean {
    const parentNodes: TrieNode<T, V>[] = []
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
