import { state } from '../../state'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Untyped RAGE:MP APIs not covered by client typings.
 */
const mpAny = mp as any

/**
 * Teleports the local player to the active map waypoint.
 */
class MarkerTeleport {
    /** Teleport the local player to the current waypoint, if set. */
    teleport(): void {
        try {
            if (!state.loggedIn || state.chatActive || state.pAdmin === 0) return
            const coords = MarkerTeleport.getWaypointCoords()
            if (coords !== null) {
                const groundZ: number = mpAny.game.gameplay.getGroundZFor3dCoord(coords.x, coords.y, coords.z, 0, false)
                state.localPlayer.setCoordsNoOffset(coords.x, coords.y, groundZ, false, false, false)
            }
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/markerteleport', 'binderFunctions.markerteleport', String(e))
        }
    }

    /**
     * Returns the active waypoint coordinates if a map blip is set.
     * @returns Waypoint coordinates or null.
     */
    private static getWaypointCoords(): Vector3 | null {
        if (!mpAny.game.ui.isWaypointActive()) return null
        const blip: number = mpAny.game.ui.getFirstBlipInfoId(8)
        if (!mpAny.game.ui.doesBlipExist(blip)) return null
        return mpAny.game.ui.getBlipInfoIdCoord(blip) as Vector3
    }
}

/** Singleton marker teleport handler. */
export const markerTeleport = new MarkerTeleport()
