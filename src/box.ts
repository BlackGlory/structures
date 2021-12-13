export class Box<T> {
  #value: T

  constructor(value: T) {
    this.#value = value
  }

  set(value: T): void {
    this.#value = value
  }

  get(): T {
    return this.#value
  }
}
