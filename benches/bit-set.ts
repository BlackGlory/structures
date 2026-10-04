import { go } from '@blackglory/go'
import { BitSet, TypedBitSet, DynamicTypedBitSet, ResizableTypedBitSet, DynamicTypedArray, ResizableTypedArray } from '../lib/index.js'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('BitSet', {
  warms: 1000
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

  ;([8, 16, 32]).forEach(bitsPerElement => {
    benchmark.addCase(`BitSet(${bitsPerElement}).values`, () => {
      const set = new BitSet(bitsPerElement)
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        [...set.values()]
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`TypedBitSet(${UintArray.name}).values`, () => {
      const set = new TypedBitSet(new UintArray(10000))
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        [...set.values()]
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`DynamicTypedBitSet(${UintArray.name}).values`, () => {
      const set = new DynamicTypedBitSet(new DynamicTypedArray(UintArray))
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        [...set.values()]
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`ResizableTypedBitSet(${UintArray.name}).values`, () => {
      const set = new ResizableTypedBitSet(
        new ResizableTypedArray(UintArray, { maxCapacity: 10000 })
      )
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        [...set.values()]
      }
    })
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

  ;([8, 16, 32]).forEach(bitsPerElement => {
    benchmark.addCase(`BitSet(${bitsPerElement}).has`, () => {
      const set = new BitSet(bitsPerElement)
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        for (let i = 10000; i--;) {
          set.has(i)
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`TypedBitSet(${UintArray.name}).has`, () => {
      const set = new TypedBitSet(new UintArray(10000))
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        for (let i = 10000; i--;) {
          set.has(i)
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`DynamicTypedBitSet(${UintArray.name}).has`, () => {
      const set = new DynamicTypedBitSet(new DynamicTypedArray(UintArray))
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        for (let i = 10000; i--;) {
          set.has(i)
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`ResizableTypedBitSet(${UintArray.name}).has`, () => {
      const set = new ResizableTypedBitSet(
        new ResizableTypedArray(UintArray, { maxCapacity: 10000 })
      )
      for (let i = 0; i < 10000; i += 2) {
        set.add(i)
      }

      return () => {
        for (let i = 10000; i--;) {
          set.has(i)
        }
      }
    })
  })

  benchmark.addCase('Set.add', () => {
    const set = new Set<number>()

    return {
      beforeEach() {
        set.clear()

        for (let i = 0; i < 10000; i += 2) {
          set.add(i)
        }
      }
    , iterate() {
        for (let i = 10000; i--;) {
          set.add(i)
        }
      }
    }
  })

  ;([8, 16, 32]).forEach(bitsPerElement => {
    benchmark.addCase(`BitSet(${bitsPerElement}).add`, () => {
      const set = new BitSet(bitsPerElement)

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.add(i)
          }
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`TypedBitSet(${UintArray.name}).add`, () => {
      const set = new TypedBitSet(new UintArray(10000))

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.add(i)
          }
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`DynamicTypedBitSet(${UintArray.name}).add`, () => {
      const set = new DynamicTypedBitSet(new DynamicTypedArray(UintArray))

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.add(i)
          }
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`ResizableTypedBitSet(${UintArray.name}).add`, () => {
      const set = new ResizableTypedBitSet(
        new ResizableTypedArray(UintArray, { maxCapacity: 10000 })
      )

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.add(i)
          }
        }
      }
    })
  })

  benchmark.addCase('Set.delete', () => {
    const set = new Set<number>()

    return {
      beforeEach() {
        set.clear()

        for (let i = 0; i < 10000; i += 2) {
          set.add(i)
        }
      }
    , iterate() {
        for (let i = 10000; i--;) {
          set.delete(i)
        }
      }
    }
  })

  ;([8, 16, 32]).forEach(bitsPerElement => {
    benchmark.addCase(`BitSet(${bitsPerElement}).delete`, () => {
      const set = new BitSet(bitsPerElement)

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.delete(i)
          }
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`TypedBitSet(${UintArray.name}).delete`, () => {
      const set = new TypedBitSet(new UintArray(10000))

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.delete(i)
          }
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`DynamicTypedBitSet(${UintArray.name}).delete`, () => {
      const set = new DynamicTypedBitSet(new DynamicTypedArray(UintArray))

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.delete(i)
          }
        }
      }
    })
  })

  ;([Uint8Array, Uint16Array, Uint32Array]).forEach(UintArray => {
    benchmark.addCase(`ResizableTypedBitSet(${UintArray.name}).delete`, () => {
      const set = new ResizableTypedBitSet(
        new ResizableTypedArray(UintArray, { maxCapacity: 10000 })
      )

      return {
        beforeEach() {
          set.clear()

          for (let i = 0; i < 10000; i += 2) {
            set.add(i)
          }
        }
      , iterate() {
          for (let i = 10000; i--;) {
            set.delete(i)
          }
        }
      }
    })
  })

  console.log(`Benchmark: ${benchmark.name}`)
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
