import { assert } from '@blackglory/errors'
import { first } from 'iterable-operator'
import { setSchedule } from 'extra-timers'

/**
 * TLRUMap = LRUMap + ExpirableMap
 */
export class TLRUMap<K, V> {
  private limit: number
  private map = new Map<K, V>()
  private cancelClearTimeout?: () => void
  /**
   * 按过期时间升序排列所有项目的元数据
   */
  protected itemMetadataSortedByExpirationTime: Array<{
    key: K
    expirationTime: number
  }> = []

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  get size(): number {
    return this.map.size
  }

  constructor(limit: number) {
    assert(Number.isInteger(limit), 'The parameter limit must be an integer')
    assert(limit > 0, 'The parameter limit must be a positive value')

    this.limit = limit
  }

  set(key: K, value: V, timeToLive: number): this {
    if (this.map.has(key)) {
      this.updateItem(key, value)
      this.removeItemMetadata(key)
      this.addItemMetadata(key, Date.now() + timeToLive)
    } else {
      if (this.map.size === this.limit) {
        this.map.delete(this.getColdestKey()!)
      }
      this.map.set(key, value)
      this.addItemMetadata(key, Date.now() + timeToLive)
    }
    return this
  }

  has(key: K): boolean {
    return this.map.has(key)
  }

  get(key: K): V | undefined {
    if (this.has(key)) {
      const value = this.map.get(key)!
      this.updateItem(key, value)
      return value
    } else {
      return undefined
    }
  }

  delete(key: K): boolean {
    const result = this.map.delete(key)
    if (result) {
      const index = this.itemMetadataSortedByExpirationTime.findIndex(x => x.key === key)
      this.itemMetadataSortedByExpirationTime.splice(index, 1)

      // 如果被删除的项目是第一个项目, 则需要重新规划过期回调
      if (index === 0) {
        this.rescheduleClearTimeout()
      }
    }
    return result
  }

  clear(): void {
    this.map.clear()
    this.cancelClearTimeout?.()
    this.itemMetadataSortedByExpirationTime = []
  }

  /**
   * 重新插入项目, 这会使项目置于#map迭代器的末端.
   */
  private updateItem(key: K, value: V): void {
    this.map.delete(key)
    this.map.set(key, value)
  }

  private addItemMetadata(key: K, expirationTime: number) {
    for (let i = 0; i < this.itemMetadataSortedByExpirationTime.length; i++) {
      const item = this.itemMetadataSortedByExpirationTime[i]
      if (expirationTime < item.expirationTime) {
        this.itemMetadataSortedByExpirationTime.splice(i, 0, { key, expirationTime })

        // 如果本次插入导致原先的第一个项目不再是第一个项目, 则需要重新规划过期回调
        if (i === 0) {
          this.rescheduleClearTimeout()
        }
        return
      }
    }

    // 如果代码运行到此处, 意味着数组要么为空, 要么新项目过期时间大于数组内的所有项目, 故直接插入到数组尾端.
    this.itemMetadataSortedByExpirationTime.push({ key, expirationTime })
    // 如果新插入的项目是唯一而项目, 则需要重新规划过期回调
    if (this.itemMetadataSortedByExpirationTime.length === 1) {
      this.rescheduleClearTimeout()
    }
  }

  private removeItemMetadata(key: K) {
    const index = this.itemMetadataSortedByExpirationTime.findIndex(x => x.key === key)
    if (index >= 0) {
      this.itemMetadataSortedByExpirationTime.splice(index, 1)

      // 如果被移除的是第一个项目, 则需要重新规划过期回调
      if (index === 0) {
        this.rescheduleClearTimeout()
      }
    }
  }

  private clearExpiredItems(timestamp: number) {
    const indexOfFirstUnexpiredItem = this.itemMetadataSortedByExpirationTime.findIndex(
      x => x.expirationTime > timestamp
    )
    const expiredItemKeys =
      indexOfFirstUnexpiredItem >= 0
      ? this.itemMetadataSortedByExpirationTime.splice(0, indexOfFirstUnexpiredItem)
      : this.itemMetadataSortedByExpirationTime.splice(0, this.itemMetadataSortedByExpirationTime.length)
    expiredItemKeys.forEach(x => this.map.delete(x.key))
  }

  private rescheduleClearTimeout() {
    this.cancelClearTimeout?.()

    if (this.itemMetadataSortedByExpirationTime.length > 0) {
      const item = this.itemMetadataSortedByExpirationTime[0]
      if (Number.isFinite(item.expirationTime)) {
        const cancel = setSchedule(item.expirationTime, () => {
          this.clearExpiredItems(Date.now())
          this.rescheduleClearTimeout()
        })
        this.cancelClearTimeout = () => {
          cancel()
          this.cancelClearTimeout = undefined
        }
      }
    }
  }

  /**
   * Return the earliest key inserted in the Map
   */
  private getColdestKey(): K | undefined {
    return first(this.map.keys())
  }
}
