import { go } from '@blackglory/go'

type Listener<Args extends unknown[], Yield, Next> = (...args: Args) =>
| void
| Generator<Yield, void, Next>

export class GeneratorEmitter<
  EventToArgs extends Record<Event, unknown[]> = Record<
    string | number | symbol
  , unknown[]
  >
, Event extends string | number | symbol = keyof EventToArgs
, Yield = unknown
, Next = unknown
> {
  private map = new Map<
    Event
  , Set<Listener<EventToArgs[Event], Yield, Next>>
  >()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  on<T extends Event>(
    event: T
  , listener: Listener<EventToArgs[T], Yield, Next>
  ): () => void {
    const set = go(() => {
      const set = this.map.get(event)
      if (set) {
        return set
      } else {
        const set = new Set<Listener<EventToArgs[keyof EventToArgs], Yield, Next>>()
        this.map.set(event, set)
        return set
      }
    })
    set.add(handler as Listener<EventToArgs[Event], Yield, Next>)

    return () => {
      const handlers = this.map.get(event)
      if (handlers) {
        const deleted = handlers.delete(
          handler as Listener<EventToArgs[Event], Yield, Next>
        )
        if (deleted && handlers.size === 0) {
          this.map.delete(event)
        }
      }
    }

    function * handler(
      ...args: Parameters<Listener<EventToArgs[T], Yield, Next>>
    ): Generator<Yield, void, Next> {
      yield* run(() => listener(...args))
    }
  }

  once<T extends Event>(
    event: T
  , listener: Listener<EventToArgs[T], Yield, Next>
  ): () => void {
    const removeListener = this.on(
      event
    , function * (
        ...args: Parameters<Listener<EventToArgs[T], Yield, Next>>
      ): Generator<Yield, void, Next> {
        yield* run(() => listener(...args))
        removeListener()
      }
    )

    return removeListener
  }

  * emit<T extends Event>(
    event: T
  , ...args: EventToArgs[T]
  ): Generator<Yield, void, Next> {
    const listeners = this.map.get(event)

    if (listeners) {
      for (const listener of listeners) {
        yield* run(() => listener(...args))
      }
    }
  }

  removeAllListeners<T extends Event>(event: T): void {
    this.map.get(event)?.clear()
  }
}

function* run<Yield, Next>(
  fn: () => void | Generator<Yield, void, Next>
): Generator<Yield, void, Next> {
  const generator = fn()
  if (generator) {
    yield* generator
  }
}
