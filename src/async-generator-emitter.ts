import { go, goAsyncGenerator } from '@blackglory/go'

type Listener<Args extends unknown[], Yield, Next> = (...args: Args) =>
| void
| Generator<Yield, void, Next>
| AsyncGenerator<Yield, void, Next>

export class AsyncGeneratorEmitter<
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

    async function * handler(
      ...args: Parameters<Listener<EventToArgs[T], Yield, Next>>
    ): AsyncGenerator<Yield, void, Next> {
      yield* goAsyncGenerator(() => listener(...args))
    }
  }

  once<T extends Event>(
    event: T
  , listener: Listener<EventToArgs[T], Yield, Next>
  ): () => void {
    const removeListener = this.on(
      event
    , async function * (
        ...args: Parameters<Listener<EventToArgs[T], Yield, Next>>
      ): AsyncGenerator<Yield, void, Next> {
        yield* goAsyncGenerator(() => listener(...args))
        removeListener()
      }
    )

    return removeListener
  }

  async * emit<T extends Event>(
    event: T
  , ...args: EventToArgs[T]
  ): AsyncGenerator<Yield, void, Next> {
    const listeners = this.map.get(event)

    if (listeners) {
      for (const listener of listeners) {
        yield* goAsyncGenerator(() => listener(...args))
      }
    }
  }

  removeAllListeners<T extends Event>(event: T): void {
    this.map.get(event)?.clear()
  }
}
