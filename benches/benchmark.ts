import { go } from '@blackglory/go'
import { BitSet, TypedBitSet, DynamicTypedArray } from '..'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('BitSet', {
  warmUps: 10000
, runs: 10000
})

go(async () => {
  benchmark.addCase('Set.values', () => {
    const set = new Set<number>()
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      [...set.values()]
    }
  })

  benchmark.addCase('TypedBitSet(Uint8).values', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      [...set.values()]
    }
  })

  benchmark.addCase('TypedBitSet(Uint16).values', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint16Array))
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      [...set.values()]
    }
  })

  benchmark.addCase('TypedBitSet(Uint32).values', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint32Array))
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      [...set.values()]
    }
  })

  benchmark.addCase('BitSet(8).values', () => {
    const set = new BitSet(8)
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      [...set.values()]
    }
  })

  benchmark.addCase('BitSet(31).values', () => {
    const set = new BitSet(31)
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      [...set.values()]
    }
  })

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

  benchmark.addCase('TypedBitSet(Uint8).has', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('TypedBitSet(Uint16).has', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint16Array))
    for (let i = 0; i < 10000; i += 2) {
      set.add(i)
    }

    return () => {
      for (let i = 10000; i--;) {
        set.has(i)
      }
    }
  })

  benchmark.addCase('TypedBitSet(Uint32).has', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint32Array))
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

  benchmark.addCase('BitSet(31).has', () => {
    const set = new BitSet(31)
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

  benchmark.addCase('TypedBitSet(Uint8).add', () => {
    return () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('TypedBitSet(Uint16).add', () => {
    return () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint16Array))

      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.add(i)
      }
    }
  })

  benchmark.addCase('TypedBitSet(Uint32).add', () => {
    return () => {
      const set = new TypedBitSet(new DynamicTypedArray(Uint32Array))

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

  benchmark.addCase('BitSet(31).add', () => {
    return () => {
      const set = new BitSet(31)

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

  benchmark.addCase('TypedBitSet(Uint8).delete', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint8Array))

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('TypedBitSet(Uint16).delete', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint16Array))

    return () => {
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      for (let i = 10000; i--;) {
        set.delete(i)
      }
    }
  })

  benchmark.addCase('TypedBitSet(Uint32).delete', () => {
    const set = new TypedBitSet(new DynamicTypedArray(Uint32Array))

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

  benchmark.addCase('BitSet(31).delete', () => {
    const set = new BitSet(31)

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
