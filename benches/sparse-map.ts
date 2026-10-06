import { go } from '@blackglory/go'
import { SparseMap, TypedSparseMap, DynamicTypedArray, CleanSparseMap, TypedSparseMapLite, TypedCleanSparseMap, TypedCleanSparseMapLite, DynamicTypedSparseMapLite, DynamicTypedCleanSparseMapLite, ResizableTypedSparseMapLite, ResizableTypedArray, ResizableTypedCleanSparseMapLite } from '../lib/index.js'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('SparseMap', {
  warms: 1000
, runs: 1000
})

go(async () => {
  benchmark.addCase('Map#has', () => {
    const map = new Map()
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('SparseMap#has', () => {
    const map = new SparseMap()
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('CleanSparseMap#has', () => {
    const map = new CleanSparseMap()
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('TypedSparseMap#has', () => {
    const map = new TypedSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('TypedSparseMapLite#has', () => {
    const map = new TypedSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMap#has', () => {
    const map = new TypedCleanSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMapLite#has', () => {
    const map = new TypedCleanSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseMapLite#has', () => {
    const map = new DynamicTypedSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('DynamicTypedCleanSparseMapLite#has', () => {
    const map = new DynamicTypedCleanSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseMapLite#has', () => {
    const map = new ResizableTypedSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('ResizableTypedCleanSparseMapLite#has', () => {
    const map = new ResizableTypedCleanSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('Map#get', () => {
    const map = new Map()
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('SparseMap#get', () => {
    const map = new SparseMap()
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('CleanSparseMap#get', () => {
    const map = new CleanSparseMap()
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('TypedSparseMap#get', () => {
    const map = new TypedSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('TypedSparseMapLite#get', () => {
    const map = new TypedSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMap#get', () => {
    const map = new TypedCleanSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMapLite#get', () => {
    const map = new TypedCleanSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseMapLite#get', () => {
    const map = new DynamicTypedSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('DynamicTypedCleanSparseMapLite#get', () => {
    const map = new DynamicTypedCleanSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseMapLite#get', () => {
    const map = new ResizableTypedSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('ResizableTypedCleanSparseMapLite#get', () => {
    const map = new ResizableTypedCleanSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('Map#set', () => {
    const map = new Map()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('SparseMap#set', () => {
    const map = new SparseMap()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('CleanSparseMap#set', () => {
    const map = new CleanSparseMap()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('TypedSparseMap#set', () => {
    const map = new TypedSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('TypedSparseMapLite#set', () => {
    const map = new TypedSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMap#set', () => {
    const map = new TypedCleanSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMapLite#set', () => {
    const map = new TypedCleanSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseMapLite#set', () => {
    const map = new DynamicTypedSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedCleanSparseMapLite#set', () => {
    const map = new DynamicTypedCleanSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseMapLite#set', () => {
    const map = new ResizableTypedSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedCleanSparseMapLite#set', () => {
    const map = new ResizableTypedCleanSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.set(i, i)
        }
      }
    }
  })

  benchmark.addCase('Map#delete', () => {
    const map = new Map()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('SparseMap#delete', () => {
    const map = new SparseMap()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('CleanSparseMap#delete', () => {
    const map = new CleanSparseMap()

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('TypedSparseMap#delete', () => {
    const map = new TypedSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('TypedSparseMapLite#delete', () => {
    const map = new TypedSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMap#delete', () => {
    const map = new TypedCleanSparseMap(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('TypedCleanSparseMapLite#delete', () => {
    const map = new TypedCleanSparseMapLite(
      new Uint16Array(10000)
    , new Uint16Array(10000)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedSparseMapLite#delete', () => {
    const map = new DynamicTypedSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('DynamicTypedCleanSparseMapLite#delete', () => {
    const map = new DynamicTypedCleanSparseMapLite(
      new DynamicTypedArray(Uint16Array)
    , new DynamicTypedArray(Uint16Array)
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedSparseMapLite#delete', () => {
    const map = new ResizableTypedSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
        }
      }
    , iterate() {
        for (let i = 0; i < 10000; i++) {
          map.delete(i)
        }
      }
    }
  })

  benchmark.addCase('ResizableTypedCleanSparseMapLite#delete', () => {
    const map = new ResizableTypedCleanSparseMapLite(
      new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    , new ResizableTypedArray(Uint16Array, { maxCapacity: 10000 })
    )

    return {
      beforeEach() {
        map.clear()

        for (let i = 0; i < 10000; i += 2) {
          map.set(i, i)
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
