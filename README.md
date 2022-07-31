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

### Emitter
```ts
type Listener<Args extends unknown[]> = (...args: Args) => void

class Emitter<EventToArgs extends Record<string, unknown[]>> {
  get [Symbol.toStringTag](): string

  on<T extends keyof EventToArgs>(
    event: T
  , listener: Listener<EventToArgs[T]>
  ): () => void
  once<T extends keyof EventToArgs>(
    event: T
  , listener: Listener<EventToArgs[T]>
  ): () => void

  emit<T extends keyof EventToArgs>(event: T, ...args: EventToArgs[T]): void
}
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

  keys(): Iterable<T[]>
  values(): Iterable<V>
  entries(): Iterable<[key: T[], value: V]>

  set(key: K, value: V): this
  has(key: K): boolean
  get(key: K): V | undefined
  delete(key: K): boolean
}
```

### FiniteStateMachine
```ts
type IFiniteStateMachineSchema<State extends string, Event extends string> =
  Record<State, Partial<Record<Event, State>>>

class FiniteStateMachine<State extends string, Event extends string> {
  get state(): State

  constructor(
    schema: IFiniteStateMachineSchema<State, Event>
  , initialState: State
  )

  matches(state: State): boolean
  can(event: Event): boolean

  /**
   * @throws {BadEventError}
   */
  send(event: Event): void
}
```

### ObservableFiniteStateMachine
```ts
interface IFiniteStateMachineStateChange<
  State extends string
, Event extends string
> {
  event: Event
  oldState: State
  newState: State
}

class ObservableFiniteStateMachine<
  State extends string
, Event extends string
> extends FiniteStateMachine<State, Event> {
  observeStateChanges(): Observable<IFiniteStateMachineStateChange<State, Event>>
}
```
