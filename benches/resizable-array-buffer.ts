import { go } from '@blackglory/go'
import { Benchmark } from 'extra-benchmark'

const benchmark = new Benchmark('ResizableArrayBuffer', {
  warms: 1000
, runs: 10000
})

go(async () => {
  benchmark.addCase('clear by resize', () => {
    const buffer = new ArrayBuffer(10000, { maxByteLength: 10000 })
    const array = new Uint8Array(buffer)

    return {
      beforeEach() {
        for (let i = 0; i < 10000; i += 2) {
          array[i] = 1
        }
      }
    , iterate() {
        buffer.resize(0)
        buffer.resize(10000)
      }
    }
  })

  benchmark.addCase('clear by fill(0)', () => {
    const buffer = new ArrayBuffer(10000, { maxByteLength: 10000 })
    const array = new Uint8Array(buffer)

    return {
      beforeEach() {
        for (let i = 0; i < 10000; i += 2) {
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
