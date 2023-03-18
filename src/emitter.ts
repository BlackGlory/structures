import { go } from '@blackglory/go'

type Listener<Args extends unknown[]> = (...args: Args) => void

export class Emitter<
  EventToArgs extends Record<Event, unknown[]> = Record<
    string | number | symbol
  , unknown[]
  >
, Event extends string | number | symbol = keyof EventToArgs
> {
  private map = new Map<
    Event
  , Set<Listener<EventToArgs[Event]>>
  >()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  on<T extends Event>(
    event: T
  , listener: Listener<EventToArgs[T]>
  ): () => void {
    const set = go(() => {
      const set = this.map.get(event)
      if (set) {
        return set
      } else {
        const set = new Set<Listener<EventToArgs[keyof EventToArgs]>>()
        this.map.set(event, set)
        return set
      }
    })
    set.add(handler as Listener<EventToArgs[Event]>)

    return () => {
      const handlers = this.map.get(event)
      if (handlers) {
        const deleted = handlers.delete(
          handler as Listener<EventToArgs[Event]>
        )
        if (deleted && handlers.size === 0) {
          this.map.delete(event)
        }
      }
    }

    function handler(...args: Parameters<Listener<EventToArgs[T]>>): void {
      listener(...args)
    }
  }

  once<T extends Event>(
    event: T
  , listener: Listener<EventToArgs[T]>
  ): () => void {
    const removeListener = this.on(
      event
    , (...args: Parameters<Listener<EventToArgs[T]>>) => {
        listener(...args)
        removeListener()
      }
    )

    return removeListener
  }

  emit<T extends Event>(event: T, ...args: EventToArgs[T]): void {
    this.map.get(event)?.forEach(cb => cb(...args))
  }
}
