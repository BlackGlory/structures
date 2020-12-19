function* IteratorWithIsLast<T>(val: ArrayLike<T>): Generator<[T, boolean]> {
  for (let i = 0, len = val.length, isLast = len - 1 === i; i < len; i++, isLast = len - 1 === i) {
    yield [val[i], isLast]
  }
}

function isEmptyObject(obj: any) {
  return Object.keys(obj).length === 0
}

class Node<T> {
  children: { [index: string]: Node<T> } = {}
  constructor(public value: T | null = null, public parent: Node<T> | null = null, public isEnd: boolean = false) {}
}

export class Trie {
  root = new Node<string>()

  addWord(word: string) {
    let root = this.root
    for (const [char, isLast] of IteratorWithIsLast(word)) {
      if (root.children[char]) {
        root = root.children[char]
        if (isLast) {
          root.isEnd = true
        }
      } else {
        root.children[char] = new Node(char, root, isLast)
        root = root.children[char]
      }
    }
  }

  add(word: string) {
    return this.addWord(word)
  }

  removeNode(node: Node<string>) {
    node.isEnd = false
    let isNodeDeleted = false
    remove(node)
    return isNodeDeleted

    function remove(node: Node<string>) {
      if (!node.isEnd && node.parent && isEmptyObject(node.children)) {
        delete node.parent.children[node.value!]
        isNodeDeleted = true
        remove(node.parent)
      }
    }
  }

  removePrefix(prefix: string) {
    let root = this.root
    for (const [char, isLast] of IteratorWithIsLast(prefix)) {
      if (root.children[char]) {
        root = root.children[char]
        if (isLast) {
          return this.removeNode(root)
        }
      } else {
        break
      }
    }
    return false
  }

  remove(prefix: string) {
    return this.removePrefix(prefix)
  }

  getNodeByPrefix(prefix: string) {
    let root = this.root
    for (const [char, isLast] of IteratorWithIsLast(prefix)) {
      if (root.children[char]) {
        root = root.children[char]
        if (isLast) {
          return root
        }
      } else {
        break
      }
    }
    return null
  }

  getNodeByWord(word: string) {
    const node = this.getNodeByPrefix(word)
    if (node!.isEnd) {
      return node
    } else {
      return null
    }
  }

  has(word: string) {
    return !!this.getNodeByWord(word)
  }

  includes(prefix: string) {
    return !!this.getNodeByPrefix(prefix)
  }

  getWalker(root: Node<string> = this.root) {
    return walk(root)

    function* walk(node: Node<string>): any {
      const keys = Object.keys(node.children)
      if (node.isEnd) {
        yield node
      }
      if (!isEmptyObject(keys)) {
        for (const key of keys) {
          yield* walk(node.children[key])
        }
      }
    }
  }

  getDictWalker(dict: any = this.toDict()) {
    const temp: string[] = []
    return walk(dict)

    function* walk(val: string): any {
      if (typeof val === 'string') {
        yield temp.join('')
      } else {
        for (const i of Object.keys(val)) {
          temp.push(i)
          yield* walk(val[i])
          temp.pop()
        }
      }
    }
  }

  getWordsByPrefix(prefix: string, limit: number = Infinity) {
    const root = this.getNodeByPrefix(prefix)
    const result = []
    if (root) {
      const prefixWord = this.getPrefixByNode(root)
      const walker = this.getWalker(root)
      while (limit--) {
        const { value: node, done } = walker.next()
        if (done) {
          break
        } else {
          result.push(prefixWord + this.getPrefixByNode(node, root))
        }
      }
    }
    return result
  }

  getPrefixByNode(node: Node<string>, untilNode = this.root) {
    const prefix = []
    while (node !== untilNode) {
      prefix.unshift(node.value)
      node = node.parent!
    }
    return prefix.join('')
  }

  toDict(root: Node<string> = this.root) {
    return find(root)

    function find(root: Node<string>) {
      const keys = Object.keys(root.children)
      if (keys.length > 0) {
        const dict: { [index: string]: any } = {}
        for (const key of keys) {
          const node = root.children[key]
          dict[node.value!] = find(node)
        }
        return dict
      } else {
        return root.value
      }
    }
  }

  toJSON(space: number) {
    return JSON.stringify(this.toDict(), null, space)
  }
}
