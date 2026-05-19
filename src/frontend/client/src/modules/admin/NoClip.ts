import { state } from '../../state'
import { VirtualKeys } from '@/src/utils/virtualKeys/VirtualKeys'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Untyped RAGE:MP APIs not covered by client typings.
 */
const mpAny = mp as any

/**
 * Admin noclip movement controller.
 */
class NoClip {
    private flying = false
    private lastTime = Date.now()
    private f = 2.0
    private l = 2.0
    private h = 2.0
    private direction: Vector3 | null = null

    /** Wires noclip event handlers. */
    constructor() {
        mp.events.addDataHandler<EntityMp>('INVISIBLE', (entity, value) => this.onInvisibleData(entity, Boolean(value)))
        gm.events.add('SetINVISIBLE', (...args: unknown[]) => this.setInvisible(Boolean(args[0])))
        gm.events.add('render', () => this.onRender())
    }

    /** Toggles noclip state and visibility. */
    toggle(): void {
        try {
            if (!state.loggedIn || state.chatActive || state.pAdmin === 0) return
            this.flying = !this.flying
            mp.events.callRemote('invisible', this.flying)
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/noclip', 'binderFunctions.noclip', String(e))
        }
    }

    /**
     * Moves the entity to the ground at its current x/y position.
     * @param entity Target entity to snap to ground.
     */
    setToGround(entity: PlayerMp = state.localPlayer): void {
        const pos = entity.position
        pos.z = mpAny.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, 0.0, false)
        entity.setCoordsNoOffset(pos.x, pos.y, pos.z, false, false, false)
    }

    /**
     * Applies invisible state to streamed entities.
     * @param entity Streamed entity.
     * @param visible True when invisibility should be applied.
     */
    private onInvisibleData(entity: EntityMp, visible: boolean): void {
        try {
            const player = entity as PlayerMp
            if (entity && mp.players.exists(player) && player.type === 'player' && entity.handle !== 0) {
                player.setVisible(!visible, false)
            }
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'synchronization/state', 'INVISIBLE', String(e))
        }
    }

    /**
     * Toggles noclip visibility and invulnerability.
     * @param toggled True when noclip is enabled.
     */
    private setInvisible(toggled: boolean): void {
        this.flying = toggled
        this.direction = mpAny.game.cam.getGameplayCamForwardVector()
        this.lastTime = Date.now()

        if (!state.adminGm) state.localPlayer.setInvincible(toggled)
        state.localPlayer.freezePosition(toggled)
        state.localPlayer.setVisible(!toggled, false)

        if (!toggled && !mp.keys.isDown(VirtualKeys.toCode('VK_SPACE'))) {
            this.setToGround()
        }
    }

    /** Per-frame noclip movement handler. */
    private onRender(): void {
        if (!this.flying || Date.now() - this.lastTime <= 150) return

        this.direction = mpAny.game.cam.getGameplayCamForwardVector()
        if (this.direction === null) return

        const pos = state.localPlayer.position
        const dir = this.direction

        let speed: number
        if (mp.keys.isDown(VirtualKeys.toCode('VK_LBUTTON'))) speed = 1.0
        else if (mp.keys.isDown(VirtualKeys.toCode('VK_RBUTTON'))) speed = 0.02
        else speed = 0.2

        if (mp.keys.isDown(VirtualKeys.toCode('KEY_W'))) {
            if (this.f < 8.0) this.f *= 1.025
            pos.x += dir.x * this.f * speed
            pos.y += dir.y * this.f * speed
            pos.z += dir.z * this.f * speed
        } else if (mp.keys.isDown(VirtualKeys.toCode('KEY_S'))) {
            if (this.f < 8.0) this.f *= 1.025
            pos.x -= dir.x * this.f * speed
            pos.y -= dir.y * this.f * speed
            pos.z -= dir.z * this.f * speed
        } else {
            this.f = 2.0
        }

        if (mp.keys.isDown(VirtualKeys.toCode('KEY_A'))) {
            if (this.l < 8.0) this.l *= 1.025
            pos.x += (-dir.y) * this.l * speed
            pos.y += dir.x * this.l * speed
        } else if (mp.keys.isDown(VirtualKeys.toCode('KEY_D'))) {
            if (this.l < 8.0) this.l *= 1.05
            pos.x -= (-dir.y) * this.l * speed
            pos.y -= dir.x * this.l * speed
        } else {
            this.l = 2.0
        }

        if (mp.keys.isDown(VirtualKeys.toCode('VK_SPACE'))) {
            if (this.h < 8.0) this.h *= 1.025
            pos.z += this.h * speed
        } else if (mp.keys.isDown(VirtualKeys.toCode('VK_CONTROL'))) {
            if (this.h < 8.0) this.h *= 1.05
            pos.z -= this.h * speed
        } else {
            this.h = 2.0
        }

        state.localPlayer.setCoordsNoOffset(pos.x, pos.y, pos.z, false, false, false)
    }
}

/** Singleton noclip controller. */
export const noClip = new NoClip()
