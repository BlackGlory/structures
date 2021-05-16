# structures

Common structures.

## Install

```sh
npm install --save @blackglory/structures
# or
yarn add @blackglory/structures
```

## API

### Cons

#### convertConsToArray

```ts
function convertConsToArray<T>([value, next]: Cons<T>): T[]
```

#### convertArrayToCons

```ts
function convertArrayToCons<T>([value, ...next]: T[]): Cons<T>
```

### Emitter

```ts
type Handler<T> = (vale: T) => void

class Emitter<T> {
  get [Symbol.toStringTag](): string

  on(event: string, handler: Handler<T>): void
  off(event: string, handler: Handler<T>): void
  emit(event: string, vale: T): void
}
```

### HashSet

```ts
class HashSet<V, K = unknown> implements Iterable<V> {
  get [Symbol.toStringTag](): string
  get size(): number
  [Symbol.iterator](): IterableIterator<V>

  constructor(hash: (value: V) => K)

  add(value: V): this
  delete(value: V): boolean
  has(value: V): boolean
  clear(): void
  values(): Iterable<V>
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
class TrieMap<K extends Iterable<T>, V, T = UnpackedIterable<K>> {
  get [Symbol.toStringTag](): string

  set(key: K, value: V): this
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
}
```
