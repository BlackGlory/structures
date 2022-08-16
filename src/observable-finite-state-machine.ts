import { FiniteStateMachine } from './finite-state-machine'
import { Subject, Observable } from 'rxjs'
import { isEmptyObject } from '@blackglory/types'

export interface IFiniteStateMachineStateChange<
  State extends string
, Event extends string
> {
  event: Event
  oldState: State
  newState: State
}

export class ObservableFiniteStateMachine<
  State extends string
, Event extends string
> extends FiniteStateMachine<State, Event> {
  private stateChanges = new Subject<IFiniteStateMachineStateChange<State, Event>>()

  get [Symbol.toStringTag](): string {
    return this.constructor.name
  }

  observeStateChanges(): Observable<IFiniteStateMachineStateChange<State, Event>> {
    return this.stateChanges
  }

  /**
   * @throws {BadEventError}
   */
  send(event: Event): void {
    const oldState = this.state
    super.send(event)
    const newState = this.state

    this.stateChanges.next({ event, oldState, newState })
    if (isEmptyObject(this.schema[newState])) {
      this.stateChanges.complete()
    }
  }
}

export { BadEventError } from './finite-state-machine'
