import { go } from '@blackglory/go'
import { BitSet } from '..'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('BitSet', {
  warmUps: 10000
, runs: 10000
})

go(async () => {
  benchmark.addCase('Set.has', () => {
    const set = new Set<number>()
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('BitSet.has', () => {
    const set = new BitSet()
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('Set.add', () => {
    return () => {
      const set = new Set<number>()

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('BitSet.add', () => {
    return () => {
      const set = new BitSet()

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('Set.delete', () => {
    const set = new Set<number>()

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('BitSet.delete', () => {
    const set = new BitSet()

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  console.log(`Benchmark: ${benchmark.name}`)
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
