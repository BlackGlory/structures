import { FiniteStateMachine, BadEventError } from '@src/finite-state-machine'
import { getError } from 'return-style'

describe('FiniteStateMachine', () => {
  test('init state and get state', () => {
    const fsm = new FiniteStateMachine({
      on: { turnOff: 'off' }
    , off: { turnOn: 'on' }
    }, 'on')

    expect(fsm.state).toBe('on')
  })

  describe('can', () => {
    describe('legal', () => {
      it('returns true', () => {
        const fsm = new FiniteStateMachine({
          on: { turnOff: 'off' }
        , off: { turnOn: 'on' }
        }, 'on')

        const result = fsm.can('turnOff')

        expect(result).toBe(true)
      })
    })

    describe('illegal', () => {
      it('returns true', () => {
        const fsm = new FiniteStateMachine({
          on: { turnOff: 'off' }
        , off: { turnOn: 'on' }
        }, 'on')

        const result = fsm.can('turnOn')
        
        expect(result).toBe(false)
      })
    })
  })

  describe('send', () => {
    describe('legal', () => {
      it('changes state', () => {
        const fsm = new FiniteStateMachine({
          on: { turnOff: 'off' }
        , off: { turnOn: 'on' }
        }, 'on')

        fsm.send('turnOff')

        expect(fsm.state).toBe('off')
      })
    })

    describe('illegal', () => {
      it('throws BadEventError', () => {
        const fsm = new FiniteStateMachine({
          on: { turnOff: 'off' }
        , off: { turnOn: 'on' }
        }, 'on')

        const err = getError(() => fsm.send('turnOn'))
        
        expect(err).toBeInstanceOf(BadEventError)
      })
    })
  })

  describe('matches', () => {
    describe('matched', () => {
      it('returns true', () => {
        const fsm = new FiniteStateMachine({
          on: { turnOff: 'off' }
        , off: { turnOn: 'on' }
        }, 'on')

        const result = fsm.matches('on')

        expect(result).toBe(true)
      })
    })

    describe('unmatched', () => {
      it('returns true', () => {
        const fsm = new FiniteStateMachine({
          on: { turnOff: 'off' }
        , off: { turnOn: 'on' }
        }, 'on')

        const result = fsm.matches('off')

        expect(result).toBe(false)
      })
    })
  })
})
