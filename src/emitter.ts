type Handler<Args extends unknown[]> = (...args: Args) => void

export class Emitter<EventToArgs extends Record<string, unknown[]>> {
  #map = new Map<keyof EventToArgs, Set<Handler<EventToArgs[keyof EventToArgs]>>>()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  /**
   * The same handler will only be registered once.
   */
  on<T extends keyof EventToArgs>(event: T, handler: Handler<EventToArgs[T]>): void {
    if (!this.#map.has(event)) {
      this.#map.set(event, new Set())
    }

    const set = this.#map.get(event)!
    set.add(handler as Handler<EventToArgs[keyof EventToArgs]>)
  }

  off<T extends keyof EventToArgs>(event: T, handler: Handler<EventToArgs[T]>): void {
    if (!this.#map.has(event)) return

    const handlers = this.#map.get(event)!
    handlers.delete(handler as Handler<EventToArgs[keyof EventToArgs]>)
    if (handlers.size === 0) {
      this.#map.delete(event)
    }
  }

  emit<T extends keyof EventToArgs>(event: T, ...args: EventToArgs[T]): void {
    if (!this.#map.has(event)) return

    this.#map.get(event)!.forEach(cb => cb(...args))
  }
}
