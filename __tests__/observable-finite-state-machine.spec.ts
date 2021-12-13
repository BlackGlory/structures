import { ObservableFiniteStateMachine, BadEventError } from '@src/observable-finite-state-machine'
import { getError } from 'return-style'

describe('ObservableFiniteStateMachine', () => {
  describe('observerStateChanges', () => {
    test('state changed', () => {
      const next = jest.fn()
      const complete = jest.fn()
      const error =jest.fn()
      const fsm = new ObservableFiniteStateMachine({
        on: { turnOff: 'off' }
      , off: { turnOn: 'on' }
      }, 'on')

      fsm.observeStateChanges().subscribe({ next, complete, error })
      fsm.send('turnOff')
      fsm.send('turnOn')

      expect(next).toBeCalledTimes(2)
      expect(next).nthCalledWith(1, {
        oldState: 'on'
      , event: 'turnOff'
      , newState: 'off'
      })
      expect(next).nthCalledWith(2, {
        oldState: 'off'
      , event: 'turnOn'
      , newState: 'on'
      })
      expect(complete).not.toBeCalled()
      expect(error).not.toBeCalled()
    })

    test('state not changed', () => {
      const next = jest.fn()
      const complete = jest.fn()
      const error = jest.fn()
      const fsm = new ObservableFiniteStateMachine({
        on: { turnOff: 'off' }
      , off: { turnOn: 'on' }
      }, 'on')

      fsm.observeStateChanges().subscribe({ next, complete, error })
      const err = getError(() => fsm.send('turnOn'))

      expect(err).toBeInstanceOf(BadEventError)
      expect(complete).not.toBeCalled()
      expect(next).not.toBeCalled()
      expect(error).not.toBeCalled()
    })

    test('complete', () => {
      const next = jest.fn()
      const complete = jest.fn()
      const error = jest.fn()
      const fsm = new ObservableFiniteStateMachine<
        'pending' | 'done'
      , 'complete'
      >({
        pending: { complete: 'done' }
      , done: {}
      }, 'pending')

      fsm.observeStateChanges().subscribe({ next, complete, error })
      fsm.send('complete')

      expect(next).toBeCalledTimes(1)
      expect(next).nthCalledWith(1, {
        oldState: 'pending'
      , event: 'complete'
      , newState: 'done'
      })
      expect(complete).toBeCalled()
      expect(error).not.toBeCalled()
    })
  })
})
