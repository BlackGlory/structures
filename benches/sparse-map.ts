import { go } from '@blackglory/go'
import { SparseMap, TypedSparseMap, DynamicTypedArray } from '..'
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

  benchmark.addCase('TypedSparseMap(Uint8)#has', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint8Array))
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('TypedSparseMap(Uint16)#has', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint16Array))
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

  benchmark.addCase('TypedSparseMap(Uint8)#get', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint8Array))
    for (let i = 0; i < 10000; i += 2) {
      map.set(i, i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.get(i)
      }
    }
  })

  benchmark.addCase('TypedSparseMap(Uint16)#get', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint16Array))
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

  benchmark.addCase('TypedSparseMap(Uint8)#set', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint8Array))

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

  benchmark.addCase('TypedSparseMap(Uint16)#set', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint16Array))

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

  benchmark.addCase('TypedSparseMap(Uint8)#delete', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint8Array))

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

  benchmark.addCase('TypedSparseMap(Uint16)#delete', () => {
    const map = new TypedSparseMap(new DynamicTypedArray(Uint16Array))

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
