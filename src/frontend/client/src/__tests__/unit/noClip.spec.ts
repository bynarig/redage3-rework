import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'
import { mpStub, gmStub, playerLocalStub } from '../setup/mp-globals'
import { state } from '@/src/state'
import { noClip } from '@/src/modules/admin/NoClip'

describe('NoClip', () => {
  // Capture the SetINVISIBLE handler registered in the constructor — used to reset flying state
  let setInvisibleHandler: (toggled: boolean) => void

  beforeAll(() => {
    const call = gmStub.events.add.mock.calls.find((c) => c[0] === 'SetINVISIBLE')
    if (!call) throw new Error('SetINVISIBLE handler not found in gm.events.add calls')
    setInvisibleHandler = (toggled: boolean) => (call[1] as (...a: unknown[]) => void)(toggled)
  })

  beforeEach(() => {
    vi.clearAllMocks()
    state.loggedIn = true
    state.pAdmin = 5
    state.chatActive = false
    state.adminGm = false
    // Ensure flying is false: call setInvisible(false) which also calls setToGround
    mpStub.keys.isDown.mockReturnValue(false)
    mpStub.game.gameplay.getGroundZFor3dCoord.mockReturnValue(5.0)
    setInvisibleHandler(false)
    vi.clearAllMocks()
    // Restore default return values
    mpStub.keys.isDown.mockReturnValue(false)
    mpStub.game.gameplay.getGroundZFor3dCoord.mockReturnValue(5.0)
  })

  describe('toggle() — guard conditions', () => {
    it('does nothing when not logged in', () => {
      state.loggedIn = false
      noClip.toggle()
      expect(mpStub.events.callRemote).not.toHaveBeenCalled()
    })

    it('does nothing when chat is active', () => {
      state.chatActive = true
      noClip.toggle()
      expect(mpStub.events.callRemote).not.toHaveBeenCalled()
    })

    it('does nothing when pAdmin is 0', () => {
      state.pAdmin = 0
      noClip.toggle()
      expect(mpStub.events.callRemote).not.toHaveBeenCalled()
    })
  })

  describe('toggle() — state transitions', () => {
    it('enables flying and calls callRemote("invisible", true)', () => {
      noClip.toggle()
      expect(mpStub.events.callRemote).toHaveBeenCalledWith('invisible', true)
    })

    it('disables flying on second toggle and calls callRemote("invisible", false)', () => {
      noClip.toggle() // on
      mpStub.events.callRemote.mockClear()
      noClip.toggle() // off
      expect(mpStub.events.callRemote).toHaveBeenCalledWith('invisible', false)
    })
  })

  describe('setToGround()', () => {
    it('fetches ground Z and moves the player to it', () => {
      mpStub.game.gameplay.getGroundZFor3dCoord.mockReturnValue(7.25)
      playerLocalStub.position = new mp.Vector3(10, 20, 50)

      noClip.setToGround()

      expect(playerLocalStub.setCoordsNoOffset).toHaveBeenCalledWith(10, 20, 7.25, false, false, false)
    })

    it('accepts an explicit entity argument', () => {
      mpStub.game.gameplay.getGroundZFor3dCoord.mockReturnValue(3.0)
      const fakePlayer = {
        position: new mp.Vector3(5, 5, 100),
        setCoordsNoOffset: vi.fn(),
      } as unknown as PlayerMp

      noClip.setToGround(fakePlayer)

      expect(fakePlayer.setCoordsNoOffset).toHaveBeenCalledWith(5, 5, 3.0, false, false, false)
    })
  })
})
