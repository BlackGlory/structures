import { setSchedule } from 'extra-timers'

export class ExpirableMap<K, V> {
  private map = new Map<K, V>()
  private cancelClearTimeout?: () => void
  /**
   * 按过期时间升序排列所有项目的元数据
   */ 
  itemMetadataSortedByExpirationTime: Array<{ key: K; expirationTime: number }> = []

  get [Symbol.toStringTag]() {
    return this.constructor.name
  }

  get size() {
    return this.map.size
  }

  set(key: K, value: V, maxAge: number): this {
    this.map.set(key, value)
    this.removeItemMetadata(key)
    this.addItemMetadata(key, Date.now() + maxAge)
    return this
  }

  has(key: K): boolean {
    return this.map.has(key)
  }

  get(key: K): V | undefined {
    return this.map.get(key)
  }

  delete(key: K): boolean {
    const exists = this.map.delete(key)
    if (exists) {
      const index = this.itemMetadataSortedByExpirationTime.findIndex(x => x.key === key)
      this.itemMetadataSortedByExpirationTime.splice(index, 1)

      // 如果被删除的项目是第一个项目, 则需要重新规划过期回调
      if (index === 0) {
        this.rescheduleClearTimeout()
      }
    }
    return exists
  }

  clear(): void {
    this.map.clear()
    this.cancelClearTimeout?.()
    this.itemMetadataSortedByExpirationTime = []
  }

  private addItemMetadata(key: K, expirationTime: number) {
    for (let i = 0; i < this.itemMetadataSortedByExpirationTime.length; i++) {
      const item = this.itemMetadataSortedByExpirationTime[i]
      if (expirationTime < item.expirationTime) {
        this.itemMetadataSortedByExpirationTime.splice(i, 0, { key, expirationTime })

        // 如果本次插入导致原先的第一个项目不再是低一个项目, 则需要重新规划过期回调
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
    const indexOfFirstUnexpired = this.itemMetadataSortedByExpirationTime.findIndex(
      x => x.expirationTime > timestamp
    )
    const expiredItemKeys =
      indexOfFirstUnexpired >= 0
      ? this.itemMetadataSortedByExpirationTime.splice(0, indexOfFirstUnexpired)
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
}
