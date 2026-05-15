import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { mpStub, gmStub } from '../setup/mp-globals'
import { state } from '@/src/state'
import { esp } from '@/src/modules/admin/Esp'

describe('Esp', () => {
  // Capture the setEspState handler once — it's registered in the constructor at import time
  let setEspStateHandler: (mode: number) => void

  beforeAll(() => {
    const call = gmStub.events.add.mock.calls.find((c) => c[0] === 'setEspState')
    if (!call) throw new Error('setEspState handler not found in gm.events.add calls')
    setEspStateHandler = (mode: number) => (call[1] as (...a: unknown[]) => void)(mode)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    state.loggedIn = true
    state.pAdmin = 5
    state.chatActive = false
    // Reset internal espMode to 0 via the registered event handler
    setEspStateHandler(0)
    // Clear side effects from the reset (showModeNotification calls notify)
    mpStub.game.graphics.notify.mockClear()
    mpStub.events.callRemote.mockClear()
  })

  describe('toggle() — guard conditions', () => {
    it('does nothing when not logged in', () => {
      state.loggedIn = false
      esp.toggle()
      expect(mpStub.events.callRemote).not.toHaveBeenCalled()
    })

    it('does nothing when chat is active', () => {
      state.chatActive = true
      esp.toggle()
      expect(mpStub.events.callRemote).not.toHaveBeenCalled()
    })

    it('does nothing when pAdmin is 0', () => {
      state.pAdmin = 0
      esp.toggle()
      expect(mpStub.events.callRemote).not.toHaveBeenCalled()
    })
  })

  describe('toggle() — mode cycling', () => {
    it('advances mode from 0 to 1 and saves state', () => {
      esp.toggle()
      expect(mpStub.events.callRemote).toHaveBeenCalledWith('saveEspState', 1)
    })

    it('shows a notification when toggling', () => {
      esp.toggle()
      expect(mpStub.game.graphics.notify).toHaveBeenCalledWith('ESP: ~g~Only Players')
    })

    it('wraps mode back to 0 after reaching 4', () => {
      // Advance to mode 4 via the internal handler
      setEspStateHandler(4)
      mpStub.events.callRemote.mockClear()

      esp.toggle()

      expect(mpStub.events.callRemote).toHaveBeenCalledWith('saveEspState', 0)
    })
  })

  describe('setEspState event', () => {
    it('sets the mode and shows the correct notification', () => {
      setEspStateHandler(3)
      expect(mpStub.game.graphics.notify).toHaveBeenCalledWith('ESP: ~g~Players & Vehicles')
    })
  })
})
