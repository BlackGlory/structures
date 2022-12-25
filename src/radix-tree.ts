import { toArray, first, map, find } from 'iterable-operator'
import { isntUndefined } from 'extra-utils'

class TreeNode<T, U> {
  children = new Map<T[], TreeNode<T, U>>()

  constructor(public value?: U) {}
}

export class RadixTree<K extends Iterable<T>, V, T = unknown> {
  private root = new TreeNode<T, V>()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  entries(): IterableIterator<[key: T[], value: V]> {
    return dfs(this.root, [])

    function* dfs(
      node: TreeNode<T, V>
    , path: T[]
    ): IterableIterator<[key: T[], value: V]> {
      for (const [prefix, childNode] of node.children) {
        const newPath = [...path, ...prefix]
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
    set(toArray(key), value, this.root)
    return this

    function set(key: T[], value: V, node: TreeNode<T, V>): void {
      const commonPrefix = findCommonPrefix(node.children.keys(), key)
      if (isntUndefined(commonPrefix)) {
        const { prefix, commonPartLength } = commonPrefix
        if (prefix.length === commonPartLength) {
          // 现有节点的前缀整个都被使用的情况, 不需要在这一级创建新的前缀节点.
          const prefixNode = node.children.get(prefix)!

          if (key.length === prefix.length) {
            // 前缀节点就是目标节点.
            prefixNode.value = value
          } else {
            // 前缀节点不是目标节点
            const newKey = key.slice(prefix.length)
            set(newKey, value, prefixNode)
          }
        } else {
          // 并非整个现有节点的前缀都被使用, 说明需要在这一级创建新的前缀节点,
          // 并将原前缀节点作为子节点接在新前缀节点之后.
          const oldPrefixNode = node.children.get(prefix)!
          const commonPrefix = prefix.slice(0, commonPartLength)
          const newPrefixNode = new TreeNode<T, V>()
          node.children.set(commonPrefix, newPrefixNode)
          newPrefixNode.children.set(prefix.slice(commonPartLength), oldPrefixNode)
          newPrefixNode.children.set(key.slice(commonPartLength), new TreeNode<T, V>(value))
          node.children.delete(prefix)
        }
      } else {
        node.children.set(key, new TreeNode(value))
      }
    }
  }

  has(key: K): boolean {
    return has(toArray(key), this.root)

    function has(key: T[], node: TreeNode<T, V>): boolean {
      const matchedPrefix = matchPrefix(node.children.keys(), key)
      if (isntUndefined(matchedPrefix)) {
        const restKey = key.slice(matchedPrefix.length)
        if (restKey.length === 0) {
          return true
        } else {
          return has(restKey, node.children.get(matchedPrefix)!)
        }
      } else {
        return false
      }
    }
  }

  get(key: K): V | undefined {
    return get(toArray(key), this.root)

    function get(key: T[], node: TreeNode<T, V>): V | undefined {
      const matchedPrefix = matchPrefix(node.children.keys(), key)
      if (isntUndefined(matchedPrefix)) {
        const restKey = key.slice(matchedPrefix.length)
        const nextNode = node.children.get(matchedPrefix)!
        if (restKey.length === 0) {
          return nextNode.value
        } else {
          return get(restKey, nextNode)
        }
      } else {
        return undefined
      }
    }
  }

  delete(key: K): boolean {
    return _delete(toArray(key), this.root)

    function _delete(key: T[], node: TreeNode<T, V>): boolean {
      const matchedPrefix = matchPrefix(node.children.keys(), key)
      if (isntUndefined(matchedPrefix)) {
        if (key.length === matchedPrefix.length) {
          // 下一个子节点就是目标节点.
          const targetNode = node.children.get(matchedPrefix)!
          if (targetNode.children.size === 0) {
            // 要删除的目标节点不是一个父节点, 可以直接删除.
            // 与目标节点共享相同前缀的其他节点可能会因此这次的删除而导致发生与父节点的合并.
            node.children.delete(matchedPrefix)
          } else {
            // 要删除的目标节点是一个父节点, 首先删除目标节点包含的值, 然后检查它的子节点是否只有一个.
            delete node.value
            if (targetNode.children.size === 1) {
              // 如果子节点只有一个, 说明目标节点的子节点可以与目标节点合并.
              // 即`(prefix, child)`合并为`(prefixchild)`.
              const [key, value] = first(targetNode.children.entries())!
              node.children.set([...matchedPrefix, ...key], value)
              node.children.delete(matchedPrefix)
            }
          }
          return true
        } else {
          // 下一个子节点不是目标节点.
          const nextNode = node.children.get(matchedPrefix)!
          const nextKey = key.slice(matchedPrefix.length)
          const deleted = _delete(nextKey, nextNode)
          if (deleted) {
            // 最终找到了目标节点并删除了它, 现在执行与nextNode有关的合并操作, 以删除不必要的节点.
            if (!('value' in nextNode)) {
              // 只有在nextNode自身不具有值的情况下, nextNode才是能够被合并的.
              switch (nextNode.children.size) {
                case 0: {
                  // 自身没有值的nextNode节点是不必要的, 因为它不是一个父节点.
                  node.children.delete(matchedPrefix)
                  break
                }
                case 1: {
                  // 自身没有值的nextNode节点是不必要的, 虽然它是一个父节点, 但它只有一个子节点.
                  // 这说明nextNode的子节点可以与nextNode合并, 替代nextNode当前的位置.
                  // 即`(prefix, child)`合并为`(prefixchild)`.
                  const [key, value] = first(nextNode.children.entries())!
                  node.children.set([...matchedPrefix, ...key], value)
                  node.children.delete(matchedPrefix)
                  break
                }
                default: {
                  // 自身没有值, 但起前缀作用的nextNode节点是必要的,
                  // 但在有后代被删除的情况下, 可能会需要合并子节点的前缀.
                  // 在此检查子节点的前缀, 如果子节点具有共同前缀, 则合并前缀.
                  const entries = toArray(nextNode.children.entries())
                  const keys = entries.map(([key]) => key)
                  const commonPrefix = getCommonPrefix(keys)
                  if (commonPrefix) {
                    const newPrefix = [...matchedPrefix, ...commonPrefix]
                    const childNode = new TreeNode<T, V>()
                    for (const [key, value] of entries) {
                      childNode.children.set(key.slice(commonPrefix.length), value)
                    }
                    node.children.set(newPrefix, childNode)
                    node.children.delete(matchedPrefix)
                  }
                }
              }
            }
            return true
          } else {
            // 最终没有找到目标节点.
            return false
          }
        }
      } else {
        return false
      }
    }
  }
}

/**
 * 查找prefixes里与path的前缀匹配的项目.
 * 
 * @param prefixes 所有前缀都不能在首部有重合.
 */
export function matchPrefix<T>(prefixes: Iterable<T[]>, path: T[]): T[] | undefined {
  return find(prefixes, prefix => path[0] === prefix[0])
}

/**
 * 查找prefixes与path的共同前缀, 结果可能是其中一整个prefix, 或者其中一个prefix的前缀部分.
 * 
 * @param prefixes 所有前缀都不能在首部有重合.
 */
export function findCommonPrefix<T>(prefixes: Iterable<T[]>, path: T[]): {
  prefix: T[]
  commonPartLength: number
} | undefined {
  for (const prefix of prefixes) {
    let commonPartLength = 0
    for (let i = 0; i < prefix.length; i++) {
      if (path[i] === prefix[i]) {
        commonPartLength++
      } else {
        if (commonPartLength > 0) {
          return { prefix, commonPartLength }
        }
      }
    }
    if (commonPartLength > 0) {
      return { prefix, commonPartLength }
    }
  }
}


/**
 * 返回一组可迭代值的共同前缀.
 */
export function getCommonPrefix<T>(paths: T[][]): T[] {
  if (paths.length > 0) {
    const commonPrefix: T[] = []

    loop: for (
      let elementIndex = 0, firstPathLength = paths[0].length
    ; elementIndex < firstPathLength
    ; elementIndex++
    ) {
      const element = paths[0][elementIndex]
      for (let pathIndex = 1; pathIndex < paths.length; pathIndex++) {
        const path = paths[pathIndex]
        if (elementIndex < path.length) {
          if (path[elementIndex] !== element) {
            break loop
          }
        } else {
          break loop
        }
      }
      commonPrefix.push(element)
    }

    return commonPrefix
  } else {
    return []
  }
}
