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
    if (!this.map.has(event)) {
      this.map.set(event, new Set())
    }

    const set = this.map.get(event)!
    set.add(handler as Listener<EventToArgs[keyof EventToArgs]>)

    return () => {
      if (!this.map.has(event)) return

      const handlers = this.map.get(event)!
      handlers.delete(handler as Listener<EventToArgs[keyof EventToArgs]>)
      if (handlers.size === 0) {
        this.map.delete(event)
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
    if (!this.map.has(event)) return

    this.map.get(event)!.forEach(cb => cb(...args))
  }
}
