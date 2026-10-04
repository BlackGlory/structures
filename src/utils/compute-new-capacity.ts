export function computeNewCapacity(
  oldCapacity: number
, targetLength: number
, growthFactor: number
): number {
  if (growthFactor === 1) {
    return targetLength
  } else {
    if (oldCapacity === targetLength) {
      return targetLength
    } else if (oldCapacity < targetLength) { 
      // 增加容量以适配targetLength
      let newCapacity = Math.max(oldCapacity, 1)
      while (newCapacity < targetLength) {
        newCapacity *= growthFactor
      }
      return Math.floor(newCapacity)
    } else {
      // 尝试减少容量以适配targetLength

      // `targetLength = 0`是特殊情况,
      // 此时无论怎么将oldCapacity除以growthFactory几次, 都不可能得到比targetLength小的结果.
      if (targetLength === 0) {
        return 0
      } else {
        let newCapacity = oldCapacity
        while (true) {
          const temp = newCapacity / growthFactor
          if (temp < targetLength) {
            break
          } else {
            newCapacity = temp
          }
        }
        return Math.floor(newCapacity)
      }
    }
  }
}
