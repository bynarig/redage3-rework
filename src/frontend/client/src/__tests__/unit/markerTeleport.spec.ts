import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mpStub, playerLocalStub } from '../setup/mp-globals'
import { state } from '@/src/state'
import { markerTeleport } from '@/src/modules/admin/MarkerTeleport'

describe('MarkerTeleport.teleport()', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    state.loggedIn = true
    state.pAdmin = 5
    state.chatActive = false
    // Default stubs: no active waypoint
    mpStub.game.ui.isWaypointActive.mockReturnValue(false)
    mpStub.game.ui.doesBlipExist.mockReturnValue(false)
  })

  describe('guard conditions', () => {
    it('does nothing when not logged in', () => {
      state.loggedIn = false
      markerTeleport.teleport()
      expect(playerLocalStub.setCoordsNoOffset).not.toHaveBeenCalled()
    })

    it('does nothing when chat is active', () => {
      state.chatActive = true
      markerTeleport.teleport()
      expect(playerLocalStub.setCoordsNoOffset).not.toHaveBeenCalled()
    })

    it('does nothing when pAdmin is 0', () => {
      state.pAdmin = 0
      markerTeleport.teleport()
      expect(playerLocalStub.setCoordsNoOffset).not.toHaveBeenCalled()
    })

    it('does nothing when there is no active waypoint', () => {
      mpStub.game.ui.isWaypointActive.mockReturnValue(false)
      markerTeleport.teleport()
      expect(playerLocalStub.setCoordsNoOffset).not.toHaveBeenCalled()
    })

    it('does nothing when the blip does not exist', () => {
      mpStub.game.ui.isWaypointActive.mockReturnValue(true)
      mpStub.game.ui.doesBlipExist.mockReturnValue(false)
      markerTeleport.teleport()
      expect(playerLocalStub.setCoordsNoOffset).not.toHaveBeenCalled()
    })
  })

  describe('happy path', () => {
    it('teleports to ground-adjusted waypoint coordinates', () => {
      mpStub.game.ui.isWaypointActive.mockReturnValue(true)
      mpStub.game.ui.doesBlipExist.mockReturnValue(true)
      mpStub.game.ui.getBlipInfoIdCoord.mockReturnValue({ x: 100, y: 200, z: 50 })
      mpStub.game.gameplay.getGroundZFor3dCoord.mockReturnValue(3.5)

      markerTeleport.teleport()

      expect(playerLocalStub.setCoordsNoOffset).toHaveBeenCalledWith(100, 200, 3.5, false, false, false)
    })

    it('queries blip 8 to get the waypoint', () => {
      mpStub.game.ui.isWaypointActive.mockReturnValue(true)
      mpStub.game.ui.doesBlipExist.mockReturnValue(true)
      mpStub.game.ui.getBlipInfoIdCoord.mockReturnValue({ x: 0, y: 0, z: 0 })
      mpStub.game.gameplay.getGroundZFor3dCoord.mockReturnValue(0)

      markerTeleport.teleport()

      expect(mpStub.game.ui.getFirstBlipInfoId).toHaveBeenCalledWith(8)
    })
  })
})
