import { go } from '@blackglory/go'
import { SparseSet, ResizableTypedSparseSet, DynamicTypedArray, ResizableTypedArray, CleanSparseSet, DynamicTypedSparseSet, DynamicTypedSparseSetLite, ResizableTypedSparseSetLite, DynamicTypedCleanSparseSet, ResizableTypedCleanSparseSet } from '../lib/index.js'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('SparseSet', {
  warms: 1000
, runs: 10000
})

go(async () => {
  benchmark.addCase('Set#has', () => {
    const map = new Set()
    for (let i = 0; i < 10000; i += 2) {
      map.add(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('SparseSet#has', () => {
    const map = new SparseSet()
    for (let i = 0; i < 10000; i += 2) {
      map.add(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('CleanSparseSet#has', () => {
    const map = new CleanSparseSet()
    for (let i = 0; i < 10000; i += 2) {
      map.add(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseSet#has', () => {
    const map = new DynamicTypedSparseSet(new DynamicTypedArray(Uint16Array))
    for (let i = 0; i < 10000; i += 2) {
      map.has(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseSetLite#has', () => {
    const map = new DynamicTypedSparseSetLite(new DynamicTypedArray(Uint16Array))
    for (let i = 0; i < 10000; i += 2) {
      map.has(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('DynamicTypedCleanSparseSet#has', () => {
    const map = new DynamicTypedCleanSparseSet(new DynamicTypedArray(Uint16Array))
    for (let i = 0; i < 10000; i += 2) {
      map.has(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseSet#has', () => {
    const map = new ResizableTypedSparseSet(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )
    for (let i = 0; i < 10000; i += 2) {
      map.has(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseSetLite#has', () => {
    const map = new ResizableTypedSparseSetLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )
    for (let i = 0; i < 10000; i += 2) {
      map.has(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('ResizableTypedCleanSparseSet#has', () => {
    const map = new ResizableTypedCleanSparseSet(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )
    for (let i = 0; i < 10000; i += 2) {
      map.has(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('Set#add', () => {
    const map = new Set()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('SparseSet#add', () => {
    const map = new SparseSet()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('CleanSparseSet#add', () => {
    const map = new CleanSparseSet()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseSet#add', () => {
    const map = new DynamicTypedSparseSet(new DynamicTypedArray(Uint16Array))

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseSetLite#add', () => {
    const map = new DynamicTypedSparseSetLite(new DynamicTypedArray(Uint16Array))

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedCleanSparseSet#add', () => {
    const map = new DynamicTypedCleanSparseSet(new DynamicTypedArray(Uint16Array))

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseSet#add', () => {
    const map = new ResizableTypedSparseSet(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseSetLite#add', () => {
    const map = new ResizableTypedSparseSetLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedCleanSparseSet#add', () => {
    const map = new ResizableTypedCleanSparseSet(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.add(i)
        }
      }
    }
  })

  benchmark.addCase('Set#delete', () => {
    const map = new Set()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('SparseSet#delete', () => {
    const map = new SparseSet()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('CleanSparseSet#delete', () => {
    const map = new CleanSparseSet()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseSet#delete', () => {
    const map = new DynamicTypedSparseSet(new DynamicTypedArray(Uint16Array))

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseSetLite#delete', () => {
    const map = new DynamicTypedSparseSetLite(new DynamicTypedArray(Uint16Array))

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedCleanSparseSet#delete', () => {
    const map = new DynamicTypedCleanSparseSet(new DynamicTypedArray(Uint16Array))

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseSet#delete', () => {
    const map = new ResizableTypedSparseSet(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseSetLite#delete', () => {
    const map = new ResizableTypedSparseSetLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedCleanSparseSet#delete', () => {
    const map = new ResizableTypedCleanSparseSet(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.add(i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  console.log(`Benchmark: ${benchmark.name}`)
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
