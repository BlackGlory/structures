import { setSchedule } from 'extra-timers'

export class ExpirableMap<K, V> {
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

  set(key: K, value: V, maxAge: number): this {
    this.#map.set(key, value)
    this.removeItem(key)
    this.addItem(key, Date.now() + maxAge)
    return this
  }

  has(key: K): boolean {
    return this.#map.has(key)
  }

  get(key: K): V | undefined {
    return this.#map.get(key)
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
}
