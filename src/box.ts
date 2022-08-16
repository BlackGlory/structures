export class Box<T> {
  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  constructor(private value: T) {}

  set(value: T): void {
    this.value = value
  }

  get(): T {
    return this.value
  }
}
