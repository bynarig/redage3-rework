import { state } from '../../state'
import { cinematicCamera } from './CinematicCamera'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Untyped RAGE:MP APIs not covered by client typings.
 */
const mpAny = mp as any

/** Mouse sensitivity multiplier for spectate camera rotation. */
const MOUSE_SENSITIVITY = 5.5

/**
 * Admin spectate camera controller.
 */
class Spectate {
    private cam: CameraMp | null = null

    /** Wires spectate event handlers. */
    constructor() {
        gm.events.add('spmode', (...args: unknown[]) => this.onSpMode(args[0] as PlayerMp, Boolean(args[1])))
        gm.events.add('render', () => this.onRender())
    }

    /** Destroys the spectate camera and resets rendering. */
    private destroyCam(): void {
        try {
            if (this.cam !== null) this.cam.destroy()
            mpAny.game.cam.renderScriptCams(false, false, 3000, true, true)
            this.cam = null
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/spectate', 'destroyCam', String(e))
        }
    }

    /** Per-frame camera rotation update while spectating. */
    private onRender(): void {
        if (!state.spectating || this.cam === null) return

        const rotation = this.cam.getRot(2)
        const xMag = mp.game.controls.getDisabledControlNormal(0, 1)
        const yMag = mp.game.controls.getDisabledControlNormal(0, 2)

        if (xMag !== 0) rotation.z = rotation.z + (-xMag) * MOUSE_SENSITIVITY
        if (yMag !== 0) {
            rotation.x = rotation.x + (-yMag) * MOUSE_SENSITIVITY
            if (rotation.x <= -89.0) rotation.x = -89.0
            else if (rotation.x >= 89.0) rotation.x = 89.0
        }

        this.cam.setRot(rotation.x, rotation.y, rotation.z, 2)
    }

    /**
     * Starts or stops spectating a target player.
     * @param target Target player.
     * @param toggle True to start spectating.
     */
    private onSpMode(target: PlayerMp, toggle: boolean): void {
        try {
            if (toggle) {
                if (target && mp.players.exists(target)) {
                    if (state.flyMode) cinematicCamera.toggle(false)

                    state.localPlayer.attachTo(target.handle, -1, 0, 0, -6, 0, 0, 0, true, false, false, false, 0, false)
                    state.spTarget = target
                    state.spectating = true

                    const rotation: Vector3 = mpAny.game.cam.getGameplayCamRot(2)
                    if (this.cam === null) {
                        this.cam = mp.cameras.new(
                            'default',
                            new mp.Vector3(target.position.x, target.position.y, target.position.z),
                            new mp.Vector3(rotation.x, rotation.y, rotation.z),
                            50
                        )
                    }
                    this.cam.setActive(true)
                    this.cam.attachToPedBone(target.handle, 31086, -2, -6, 5, false)
                    mpAny.game.cam.renderScriptCams(true, false, 0, true, false)
                } else {
                    this.destroyCam()
                    mp.events.callRemote('UnSpectate')
                }
            } else {
                this.destroyCam()
                state.spTarget = null
                state.localPlayer.detach(true, true)
                state.spectating = false
            }
            state.localPlayer.freezePosition(toggle)
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/spectate', 'spmode', String(e))
        }
    }
}

/** Singleton spectate controller. */
export const spectate = new Spectate()
