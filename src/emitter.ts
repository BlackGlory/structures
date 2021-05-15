type Handler<T> = (value: T) => void

export class Emitter<T> {
  #map = new Map<string, Set<Handler<T>>>()

  /**
   * The same handler will only be registered once.
   */
  on(event: string, handler: Handler<T>): void {
    if (!this.#map.has(event)) {
      this.#map.set(event, new Set())
    }

    const set = this.#map.get(event)!
    set.add(handler)
  }

  off(event: string, handler: Handler<T>): void {
    if (!this.#map.has(event)) return

    const handlers = this.#map.get(event)!
    handlers.delete(handler)
    if (handlers.size === 0) {
      this.#map.delete(event)
    }
  }

  emit(event: string, value: T): void {
    if (!this.#map.has(event)) return

    const set = this.#map.get(event)!
    set.forEach(cb => cb(value))
  }
}
