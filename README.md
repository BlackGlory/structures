# structures
Common structures.

## Install
```sh
npm install --save @blackglory/structures
# or
yarn add @blackglory/structures
```

## API
### Box
```ts
class Box<T> {
  get [Symbol.toStringTag](): string

  constructor(value: T)

  get(): T
  set(value: T): void
}
```

### Cons
#### convertConsToArray
```ts
function convertConsToArray<T>([value, next]: Cons<T>): T[]
```

#### convertArrayToCons
```ts
function convertArrayToCons<T>([value, ...next]: T[]): Cons<T>
```

### Array
#### sliceArrayLeft
```ts
function sliceArrayLeft<T>(arr: T[], num: number): T[]
```

#### sliceArrayRight
```ts
function sliceArrayRight<T>(arr: T[], num: number): T[]
```

#### truncateArrayLeft
```ts
function truncateArrayLeft<T>(arr: T[], num: number): void
```

#### truncateArrayRight
```ts
function truncateArrayRight<T>(arr: T[], num: number): void
```

### Emitter
```ts
type Listener<Args extends unknown[]> = (...args: Args) => void

class Emitter<
  EventToArgs extends Record<Key, unknown[]> = Record<
    string | number | symbol
  , unknown[]
  >
, Key extends string | number | symbol = keyof EventToArgs
> {
  get [Symbol.toStringTag](): string

  on<T extends Key>(
    event: T
  , listener: Listener<EventToArgs[T]>
  ): () => void
  once<T extends Key>(
    event: T
  , listener: Listener<EventToArgs[T]>
  ): () => void

  emit<T extends Key>(event: T, ...args: EventToArgs[T]): void
}
```

### BigMap
```ts
class BigMap<K, V> implements Iterable<[K, V]> {
  get [Symbol.toStringTag](): string

  get size(): number

  set(key: K, value: V): void
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
  clear(): void

  entries(): IterableIterator<[K, V]>
  keys(): IterableIterator<K>
  values(): IterableIterator<V>
}
```

The `Map` that supports unlimited elements.

Note that `BigMap` cannot preserve the insertion order of elements.

```ts
// Map
const map = new Map()
for (let i = 0; i < 100_000_000; i++) {
  map.set(i, null) // RangeError
}
console.log('Never')

// BigMap
const { BigMap } = require('.')
const map = new BigMap()
for (let i = 0; i < 100_000_000; i++) {
  map.set(i, null)
}
console.log('Done')
```

### BigSet
```ts
class BigSet<T> implements Iterable<T> {
  get [Symbol.toStringTag]: string

  get size(): number

  add(value: T): this
  has(value: T): boolean
  delete(value: T): boolean
  clear(): void

  values(): IterableIterator<T>
}
```

The `Set` that supports unlimited elements.

Note that `BigSet` cannot preserve the insertion order of elements.

```ts
// Set
const set = new Set()
for (let i = 0; i < 100_000_000; i++) {
  set.add(i) // RangeError
}
console.log('Never')

// BigSet
const set = new BigSet()
for (let i = 0; i < 100_000_000; i++) {
  set.add(i)
}
console.log('Done')
```

### HashMap
```ts
class HashMap<K, V, Hash = unknown> {
  get [Symbol.toStringTag](): string
  get size(): number

  constructor(hash: (key: K) => Hash)

  set(key: K, value: V): this
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
  clear(): void
}
```

### HashSet
```ts
class HashSet<V, Hash = unknown> implements Iterable<V> {
  get [Symbol.toStringTag](): string
  get size(): number
  [Symbol.iterator](): IterableIterator<V>

  constructor(hash: (value: V) => Hash)

  add(value: V): this
  delete(value: V): boolean
  has(value: V): boolean
  clear(): void
  values(): IterableIterator<V>
}
```

### LRUMap
```ts
class LRUMap<K, V> {
  get [Symbol.toStringTag](): string
  get size(): number

  constructor(limit: number)

  set(key: K, value: V): this
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
  clear(): void
}
```

### ExpirableMap
```ts
class ExpirableMap<K, V> {
  get[Symbol.toStringTag](): string
  get size(): number

  constructor()

  set(key: K, value: V, maxAge: number): this
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
  clear(): void
}
```

### TLRUMap
```ts
class TLRUMap<K, V> {
  get[Symbol.toStringTag](): string
  get size(): number

  constructor(limit: number)

  set(key: K, value: V, maxAge: number): this
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
  clear(): void
}
```

### Queue
```ts
class Queue<T> {
  get [Symbol.toStringTag](): string
  get size(): number

  empty(): void
  enqueue(...items: T[]): void
  dequeue(): T | undefined
  remove(item: T): void
}
```

### TrieMap
```ts
class TrieMap<K extends Iterable<T>, V, T = unknown> {
  get [Symbol.toStringTag](): string

  keys(): IterableIterator<T[]>
  values(): IterableIterator<V>
  entries(): IterableIterator<[key: T[], value: V]>

  set(key: K, value: V): this
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
}
```

### SparseSet
```ts
class SparseSet implements Iterable<number> {
  get [Symbol.toStringTag](): string
  get [Symbol.iterator](): IterableIterator<number>

  constructor(array?: number[])

  values(): IterableIterator<number>

  has(value: number): boolean
  add(value: number): void
  delete(value: number): boolean
}
```

Note that `SparseSet` is not faster than JavaScript's built-in `Set` in many cases.

### SparseMap
```ts
class SparseMap<T> {
  get [Symbol.toStringTag](): string
  get size(): number

  /**
   * `SparseMap` cannot respond to any operations on the internal array,
   * you must ensure that indexes accessed are less than the length of `SparseMap`.
   * 
   * Keys do not correspond to indexes of the array.
   */
  get internalArray(): T[]

  entries(): IterableIterator<[key: number, value: T]>
  keys(): IterableIterator<number>
  values(): IterableIterator<T>

  getInternalIndexOfKey(key: number): number | undefined

  has(key: number): boolean
  get(key: number): T | undefined
  set(key: number, value: T): void
  delete(key: number): void
}
```

### DynamicTypedArray
```ts
class DynamicTypedArray<T extends TypedArrayConstructor> {
  get [Symbol.toStringTag](): string
  get BYTES_PER_ELEMENT(): number
  get capacity(): number
  get length(): number
  readonly growthFactor: number

  /**
   * `DynamicTypedArray` cannot respond to any operations on the internal array,
   * you must ensure that indexes accessed are less than the length of `DynamicTypedArray`.
   */
  get internalTypedArray(): TypedArrayOfConstructor<T>

  constructor(
    typedArrayConstructor: T
  , options?: {
      capacity?: number = 0
      growthFactor?: number = 1.5
    }
  )

  set(index: number, value: number): void
  get(index: number): number | undefined
  push(...values: number[]): void
  pop(): number | undefined
  sort(compare?: (a: number, b: number) => number): void
}
```

### TypedSparseSet
```ts
class TypedSparseSet<T extends UnsignedTypedArrayConstructor> {
  get [Symbol.toStringTag](): string
  get [Symbol.iterator](): IterableIterator<number>

  constructor(array: DynamicTypedArray<T>)

  values(): IterableIterator<number>

  has(value: number): boolean
  add(value: number): void
  delete(value: number): boolean
}
```

### TypedSparseMap
```ts
class TypedSparseMap<T extends TypedArrayConstructor> {
  get [Symbol.toStringTag](): string
  get size(): number

  /**
   * `SparseMap` cannot respond to any operations on the internal array,
   * you must ensure that indexes accessed are less than the length of `SparseMap`.
   * 
   * Keys do not correspond to indexes of the array.
   */
  get internalTypedArray(): TypedArrayOfConstructor<T>

  constructor(array: DynamicTypedArray<T>)

  entries(): IterableIterator<[key: number, value: number]>
  keys(): IterableIterator<number>
  values(): IterableIterator<number>

  getInternalIndexOfKey(key: number): number | undefined

  has(key: number): boolean
  get(key: number): T | undefined
  set(key: number, value: number): void
  delete(key: number): void
}
```

### SortedSet
```ts
class SortedSet<T> {
  get [Symbol.toStringTag](): string
  [Symbol.iterator](): IterableIterator<T>

  constructor(compare: (a: T, b: T) => number)

  values(): IterableIterator<T>
  has(value: T): boolean
  add(value: T): void
  delete(value: T): void
}
```

### BitSet
```ts
class BitSet {
  get [Symbol.toStringTag](): string
  get size(): number
  [Symbol.iterator](): IterableIterator<number>

  constructor(bitsPerElement: number = 8)

  values(): IterableIterator<number>

  has(value: number): boolean
  add(value: number): boolean
  delete(value: number): boolean
  clear(): void
}
```

Due to the length of arrays supported by JavaScript,
`BitSet` cannot support very large values.

### TypedBitSet
```ts
class TypedBitSet<T extends UnsignedTypedArrayConstructor> {
  get [Symbol.toStringTag](): string
  get size(): number
  [Symbol.iterator](): IterableIterator<number>

  constructor(array: DynamicTypedArray<T>)

  values(): IterableIterator<number>

  has(value: number): boolean
  add(value: number): boolean
  delete(value: number): boolean
  clear(): void
}
```

Due to the length of arrays supported by JavaScript,
`TypedBitSit` cannot support very large values.
