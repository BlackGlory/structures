import { go } from '@blackglory/go'

type Listener<Args extends unknown[]> = (...args: Args) => void

export class Emitter<EventToArgs extends Record<string, unknown[]>> {
  private map = new Map<
    keyof EventToArgs
  , Set<Listener<EventToArgs[keyof EventToArgs]>>
  >()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  on<T extends keyof EventToArgs>(
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
    set.add(handler as Listener<EventToArgs[keyof EventToArgs]>)

    return () => {
      const handlers = this.map.get(event)
      if (handlers) {
        const deleted = handlers.delete(
          handler as Listener<EventToArgs[keyof EventToArgs]>
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

  once<T extends keyof EventToArgs>(
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

  emit<T extends keyof EventToArgs>(event: T, ...args: EventToArgs[T]): void {
    this.map.get(event)?.forEach(cb => cb(...args))
  }
}
