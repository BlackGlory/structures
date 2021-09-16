import { assert } from '@blackglory/errors'
import { first } from 'iterable-operator'
import { setSchedule } from 'extra-timers'

/**
 * TLRUMap = LRUMap + ExpirableMap
 */
export class TLRUMap<K, V> {
  #limit: number
  #map = new Map<K, V>()
  #cancelNextTimeout?: () => void
  /**
   * 按过期时间升序排列所有Map项目的信息
   */ 
  itemsSortedByExpirationTime: Array<{ key: K; expirationTime: number }> = []

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  get size() {
    return this.#map.size
  }

  constructor(limit: number) {
    assert(Number.isInteger(limit), 'The parameter limit must be an integer')
    assert(limit > 0, 'The parameter limit must be a positive value')

    this.#limit = limit
  }

  set(key: K, value: V, maxAge: number): this {
    if (this.#map.has(key)) {
      this.updateItem(key, value)
      this.removeItem(key)
      this.addItem(key, Date.now() + maxAge)
    } else {
      if (this.#map.size === this.#limit) {
        this.#map.delete(this.getColdestKey()!)
      }
      this.#map.set(key, value)
      this.addItem(key, Date.now() + maxAge)
    }
    return this
  }

  has(key: K): boolean {
    return this.#map.has(key)
  }

  get(key: K): V | undefined {
    if (this.has(key)) {
      const value = this.#map.get(key)!
      this.updateItem(key, value)
      return value
    } else {
      return undefined
    }
  }

  delete(key: K): boolean {
    const result = this.#map.delete(key)
    if (result) {
      const index = this.itemsSortedByExpirationTime.findIndex(x => x.key === key)
      this.itemsSortedByExpirationTime.splice(index, 1)

      // 如果被删除的项目是第一个项目, 则需要重新规划过期回调
      if (index === 0) {
        this.rescheduleTimeout()
      }
    }
    return result
  }

  clear(): void {
    this.#map.clear()
    this.#cancelNextTimeout?.()
    this.itemsSortedByExpirationTime = []
  }

  /**
   * 重新插入项目, 这会使项目置于#map迭代器的末端.
   */
  private updateItem(key: K, value: V): void {
    this.#map.delete(key)
    this.#map.set(key, value)
  }

  private addItem(key: K, expirationTime: number) {
    for (let i = 0; i < this.itemsSortedByExpirationTime.length; i++) {
      const item = this.itemsSortedByExpirationTime[i]
      if (expirationTime < item.expirationTime) {
        this.itemsSortedByExpirationTime.splice(i, 0, { key, expirationTime })

        // 如果本次插入导致原先的第一个项目不再是低一个项目, 则需要重新规划过期回调
        if (i === 0) {
          this.rescheduleTimeout()
        }
        return
      }
    }

    // 如果代码运行到此处, 意味着数组要么为空, 要么新项目过期时间大于数组内的所有项目, 故直接插入到数组尾端.
    this.itemsSortedByExpirationTime.push({ key, expirationTime })
    // 如果新插入的项目是唯一而项目, 则需要重新规划过期回调
    if (this.itemsSortedByExpirationTime.length === 1) {
      this.rescheduleTimeout()
    }
  }

  private removeItem(key: K) {
    const index = this.itemsSortedByExpirationTime.findIndex(x => x.key === key)
    if (index >= 0) {
      this.itemsSortedByExpirationTime.splice(index, 1)

      // 如果被移除的是第一个项目, 则需要重新规划过期回调
      if (index === 0) {
        this.rescheduleTimeout()
      }
    }
  }

  private clearExpiredItems(timestamp: number) {
    const indexOfFirstUnexpiredItem = this.itemsSortedByExpirationTime.findIndex(
      x => x.expirationTime > timestamp
    )
    const expiredItems =
      indexOfFirstUnexpiredItem >= 0
      ? this.itemsSortedByExpirationTime.splice(0, indexOfFirstUnexpiredItem)
      : this.itemsSortedByExpirationTime.splice(0, this.itemsSortedByExpirationTime.length)
    expiredItems.forEach(x => this.#map.delete(x.key))
  }

  private rescheduleTimeout() {
    this.#cancelNextTimeout?.()

    if (this.itemsSortedByExpirationTime.length > 0) {
      const item = this.itemsSortedByExpirationTime[0]
      if (Number.isFinite(item.expirationTime)) {
        const cancel = setSchedule(item.expirationTime, () => {
          this.clearExpiredItems(Date.now())
          this.rescheduleTimeout()
        })
        this.#cancelNextTimeout = () => {
          cancel()
          this.#cancelNextTimeout = undefined
        }
      }
    }
  }

  /**
   * Return the earliest key inserted in the Map
   */
  private getColdestKey(): K | undefined {
    return first(this.#map.keys())
  }
}
