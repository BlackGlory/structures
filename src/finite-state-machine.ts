import { CustomError } from '@blackglory/errors'

export type IFiniteStateMachineSchema<State extends string, Event extends string> =
  Record<State, Partial<Record<Event, State>>>

export class FiniteStateMachine<State extends string, Event extends string> {
  private _state: State
  get state(): State {
    return this._state
  }

  constructor(
    protected schema: IFiniteStateMachineSchema<State, Event>
  , initialState: State
  ) {
    this._state = initialState
  }

  matches(state: State): boolean {
    return this._state === state
  }

  can(event: Event): boolean {
    return event in this.schema[this.state]
  }

  /**
   * @throws {BadEventError}
   */
  send(event: Event): void {
    if (this.can(event)) {
      this._state = this.schema[this.state][event]!
    } else {
      throw new BadEventError(this.state, event)
    }
  }
}

export class BadEventError extends CustomError {
  constructor(state: string, event: string) {
    super(`State ${state} cannot react to event ${event}`)
  }
}
