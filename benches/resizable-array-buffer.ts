import { go } from '@blackglory/go'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('ResizableArrayBuffer', {
  warms: 100
, runs: 1000
})

go(async () => {
  benchmark.addCase('clear by resize', () => {
    const buffer = new ArrayBuffer(100000, { maxByteLength: 100000 })
    const array = new Uint8Array(buffer)

    return {
      beforeEach() {
        for (let i = 0; i < 100000; i += 2) {
          array[i] = 1
        }
      }
    , iterate() {
        buffer.resize(0)
        buffer.resize(100000)
      }
    }
  })

  benchmark.addCase('clear by fill(0)', () => {
    const buffer = new ArrayBuffer(100000, { maxByteLength: 100000 })
    const array = new Uint8Array(buffer)

    return {
      beforeEach() {
        for (let i = 0; i < 100000; i += 2) {
          array[i] = 1
        }
      }
    , iterate() {
        array.fill(0)
      }
    }
  })

  console.log(`Benchmark: ${benchmark.name}`)
  for await (const result of benchmark.run()) {
    console.log(result)
  }
})
