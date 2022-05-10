import { assert } from '@blackglory/errors'
import { Awaitable } from 'justypes'
import { Mutex } from 'extra-promise'

export class InstanceManager<T> {
  private instances: T[] = []
  private targetQuantity: number = 0
  private lock: Mutex = new Mutex()

  constructor(
    private construct: () => Awaitable<T>
  , private destruct: (instance: T) => Awaitable<void>
  ) {}

  getInstances(): T[] {
    return [...this.instances]
  }

  async removeInstance(instance: T): Promise<void> {
    const index = this.instances.indexOf(instance)
    if (index >= 0) {
      this.instances.splice(this.instances.indexOf(instance), 1)
      await this.destruct(instance)
    }
  }

  getCurrentQuantity(): number {
    return this.instances.length
  }

  getTargetQuantity(): number {
    return this.targetQuantity
  }

  setTargetQuantity(target: number): void {
    assert(target >= 0, 'target quantity must be greater than or equal to 0')
    assert(Number.isInteger(target), 'target quantity must be integer')

    this.targetQuantity = target
  }

  scale(): Promise<void> {
    return this.lock.acquire(async () => {
      while (this.instances.length !== this.targetQuantity) {
        while (this.instances.length < this.targetQuantity) {
          this.instances.push(await this.construct())
        }

        while (this.instances.length > this.targetQuantity) {
          const instance = this.instances.pop()!
          await this.destruct(instance)
        }
      }
    })
  }
}
