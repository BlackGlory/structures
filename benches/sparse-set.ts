import { go } from '@blackglory/go'
import { SparseSet, TypedSparseSet, DynamicTypedArray } from '../lib/index.js'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('SparseSet', {
  warms: 1000
, runs: 1000
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

  benchmark.addCase('TypedSparseSet(Uint16)#has', () => {
    const map = new TypedSparseSet(new DynamicTypedArray(Uint16Array))
    for (let i = 0; i < 10000; i += 2) {
      map.has(i)
    }

    return () => {
      for (let i = 0; i < 10000; i++) {
        map.has(i)
      }
    }
  })

  benchmark.addCase('Set#set', () => {
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

  benchmark.addCase('SparseSet#set', () => {
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

  benchmark.addCase('TypedSparseSet(Uint16)#set', () => {
    const map = new TypedSparseSet(new DynamicTypedArray(Uint16Array))

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

  benchmark.addCase('TypedSparseSet(Uint16)#delete', () => {
    const map = new TypedSparseSet(new DynamicTypedArray(Uint16Array))

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
