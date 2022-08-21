import { isntNull } from '@blackglory/types'

export class SkipListNode<T> {
  previous: SkipListNode<T> | null = null
  next: SkipListNode<T> | null = null
  up: SkipListNode<T> | null = null
  down: SkipListNode<T> | null = null

  constructor(public value: T | null) {}
}

export class SkipList<T> {
  // 最顶层的首个节点
  private head: SkipListNode<T> = new SkipListNode<T>(null)
  // 最顶层的最后一个节点
  private tail: SkipListNode<T> = new SkipListNode<T>(null)

  private height: number = 0
  private _size: number = 0

  // 元素数量
  get size(): number {
    return this._size
  }

  constructor(private compare: (a: T, b: T) => number) {
    this.head.next = this.tail
    this.tail.previous = this.head
  }

  * elements(): IterableIterator<SkipListNode<T>> {
    let currentNode: SkipListNode<T> = this.head

    while (currentNode.down) {
      currentNode = currentNode.down
    }

    while (currentNode.next && isntNull(currentNode.next.value)) {
      currentNode = currentNode.next
      yield currentNode
    }
  }

  dumpList(): Array<Array<T | null | undefined>> {
    const result: Array<Array<T | null | undefined>> = []
    let head: SkipListNode<T> | null = this.head

    do {
      result.push([])
      let currentNode: SkipListNode<T> | null = head
      do {
        result[result.length - 1].push(currentNode.value)
        currentNode = currentNode.next
      } while (currentNode)
    } while (head = head.down)

    return result
  }

  delete(value: T): void {
    let currentNode: SkipListNode<T> | null = this.findNode(value)

    while (currentNode) {
      // 被删除的节点肯定不会是head或tail, 因此一定有previous
      currentNode.previous!.next = currentNode.next

      // 被删除的节点肯定不会是head或tail, 因此一定有next
      currentNode.next!.previous = currentNode.previous

      currentNode = currentNode.down
    }

    this._size--
  }

  has(value: T): boolean {
    return isntNull(this.findNode(value))
  }

  findNode(value: T): SkipListNode<T> | null {
    let currentNode: SkipListNode<T> = this.head

    while (true) {
      while (currentNode.next && isntNull(currentNode.next.value)) {
        const result = this.compare(currentNode.next.value, value)
        if (result === 0) {
          return currentNode.next
        } else if (result < 0) {
          currentNode = currentNode.next
        } else {
          break
        }
      }

      if (currentNode.down) {
        currentNode = currentNode.down
      } else {
        return null
      }
    }
  }

  add(value: T): void {
    let previousNode: SkipListNode<T> = this.findPreviousNode(value)

    // 如果previousNode.next.value等于value, 则说明value已经存在
    if (
      previousNode.next &&
      isntNull(previousNode.next.value) &&
      this.compare(previousNode.next.value, value) === 0
    ) {
      return
    }

    let newNode: SkipListNode<T> = new SkipListNode(value)
    // 在底层加入新节点
    if (previousNode.next) {
      newNode.next = previousNode.next
      previousNode.next.previous = newNode
    }
    previousNode.next = newNode
    newNode.previous = previousNode

    // 在高层加入新节点, 具体加到多高是随机的, 从第一层(将其视作索引值0)开始建造
    // 层数非常高是极为罕见的, 因为每次建造层都会导致下一层被建造的概率减半.
    let level = 0
    while (Math.random() < 0.5) {
      // currentLevel的索引与当前跳跃列表的高度相同, 需要在这之上建立一个新层
      if (level === this.height) {
        const newHead: SkipListNode<T> = new SkipListNode<T>(null)
        const newTail: SkipListNode<T> = new SkipListNode<T>(null)

        newHead.next = newTail
        newHead.down = this.head

        newTail.previous = newHead
        newTail.down = this.tail

        this.head.up = newHead
        this.tail.up = newTail

        this.head = newHead
        this.tail = newTail

        this.height++
      }

      // 从新节点的前一个节点遍历, 直到找到能够通往上层的节点
      while (!previousNode.up) {
        // head节点必然会有up, 所以不可能访问进入循环体, 不可能访问`head.previous`
        previousNode = previousNode.previous!
      }
      // 上一层的对应节点
      previousNode = previousNode.up!

      // 创建新节点的上层节点
      const upperNewNode: SkipListNode<T> = new SkipListNode<T>(value)
      if (previousNode.next) {
        upperNewNode.next = previousNode.next
        previousNode.next.previous = upperNewNode
      }
      previousNode.next = upperNewNode
      upperNewNode.previous = previousNode

      upperNewNode.down = newNode
      newNode.up = upperNewNode
      newNode = upperNewNode

      level++
    }

    this._size++
  }

  private findPreviousNode(value: T): SkipListNode<T> {
    let currentNode: SkipListNode<T> = this.head

    while (true) {
      while (currentNode.next && isntNull(currentNode.next.value)) {
        const result = this.compare(currentNode.next.value, value)
        if (result >= 0) {
          break
        } else {
          currentNode = currentNode.next
        }
      }

      if (currentNode.down) {
        currentNode = currentNode.down
      } else {
        return currentNode
      }
    }
  }
}
