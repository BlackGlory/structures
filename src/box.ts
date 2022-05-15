export class Box<T> {
  constructor(private value: T) {}

  set(value: T): void {
    this.value = value
  }

  get(): T {
    return this.value
  }
}
