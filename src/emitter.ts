type Handler<T> = (value: T) => void

export class Emitter<T> {
  #map = new Map<string, Set<Handler<T>>>()

  on(event: string, handler: Handler<T>) {
    if (!this.#map.has(event)) this.#map.set(event, new Set())
    const set = this.#map.get(event)!
    set.add(handler)
  }

  off(event: string, handler: Handler<T>) {
    if (this.#map.has(event)) {
      const set = this.#map.get(event)!
      set.delete(handler)
      if (set.size === 0) this.#map.delete(event)
    }
  }

  emit(event: string, value: T) {
    if (this.#map.has(event)) {
      const set = this.#map.get(event)!
      set.forEach(cb => cb(value))
    }
  }
}
