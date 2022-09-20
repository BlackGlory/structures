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

  benchmark.addCase('BitSet(8).has', () => {
    const set = new BitSet(8)
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('BitSet(64).has', () => {
    const set = new BitSet(64)
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('BitSet(128).has', () => {
    const set = new BitSet(128)
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('BitSet(256).has', () => {
    const set = new BitSet(256)
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('BitSet(512).has', () => {
    const set = new BitSet(512)
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('BitSet(1024).has', () => {
    const set = new BitSet(1024)
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

  benchmark.addCase('BitSet(8).add', () => {
    return () => {
      const set = new BitSet(8)

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('BitSet(64).add', () => {
    return () => {
      const set = new BitSet(64)

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('BitSet(128).add', () => {
    return () => {
      const set = new BitSet(128)

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('BitSet(256).add', () => {
    return () => {
      const set = new BitSet(256)

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('BitSet(512).add', () => {
    return () => {
      const set = new BitSet(512)

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('BitSet(1024).add', () => {
    return () => {
      const set = new BitSet(1024)

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

  benchmark.addCase('BitSet(8).delete', () => {
    const set = new BitSet(8)

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('BitSet(64).delete', () => {
    const set = new BitSet(64)

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('BitSet(128).delete', () => {
    const set = new BitSet(128)

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('BitSet(256).delete', () => {
    const set = new BitSet(256)

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('BitSet(512).delete', () => {
    const set = new BitSet(512)

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('BitSet(1024).delete', () => {
    const set = new BitSet(1024)

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
