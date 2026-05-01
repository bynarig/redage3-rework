import { state } from '../../state'
import { VirtualKeys } from '@/src/utils/virtualKeys/VirtualKeys'

// Untyped RAGE:MP game APIs (cam pool methods, UI queries, gameplay natives)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Untyped RAGE:MP APIs not covered by client typings.
 */
const mpAny = mp as any

// Available in the RAGE:MP V8 runtime but not in @ragempcommunity/types-client
/**
 * Native invoke binding exposed by the RAGE:MP client runtime.
 * @param name Native function name.
 */
declare function nativeInvoke(name: string): void

/**
 * Free-fly cinematic camera controller for admin use.
 */
class CinematicCamera {
    private flycam: CameraMp | null = null
    private fov = 50.0
    private movementSpeed = 20.0
    private readonly mouseSensitivity = 5.5

    // Transition progress [0–1] for each movement axis
    private readonly ticks = {
        ctrl: 0, space: 0, left: 0, right: 0,
        up: 0, down: 0, turnR: 0, turnL: 0,
        a: 0, d: 0, w: 0, s: 0,
    }

    // Per-axis state machine: 1 = accelerating, 2 = decelerating, 3 = idle
    private readonly movement = {
        up: 3, down: 3, ctrl: 3, space: 3,
        a: 3, d: 3, w: 3, s: 3,
        left: 3, right: 3, turnL: 3, turnR: 3,
    }

    /** Wires flycam event handlers. */
    constructor() {
        gm.events.add('client.flycam', () => this.onFlycamToggle())
        gm.events.add('client.flycam.time', (...args: unknown[]) => this.onSetSpeed(args[0] as number))
        gm.events.add('render', () => this.onRender())
    }

    /**
     * Enables or disables the fly camera.
     * @param on True to enable the camera.
     */
    toggle(on: boolean): void {
        try {
            if (on) {
                const position = state.localPlayer.position
                const rotation: Vector3 = mpAny.game.cam.getGameplayCamRot(2)
                this.flycam = mp.cameras.new(
                    'default',
                    new mp.Vector3(position.x, position.y, position.z),
                    new mp.Vector3(rotation.x, rotation.y, rotation.z),
                    this.fov
                )
                this.flycam.setActive(true)
                mpAny.game.cam.renderScriptCams(true, false, 0, true, false)
                state.flyMode = true
                mp.gui.cursor.visible = false
            } else {
                state.flyMode = false
                if (this.flycam !== null) this.flycam.destroy()
                mpAny.game.cam.renderScriptCams(false, false, 500, true, false)
                this.flycam = null

                if (!mp.keys.isDown(VirtualKeys.toCode('VK_SPACE'))) {
                    const pos = state.localPlayer.position
                    const groundZ: number = mpAny.game.gameplay.getGroundZFor3dCoord(pos.x, pos.y, pos.z, 0, false)
                    state.localPlayer.setCoordsNoOffset(pos.x, pos.y, groundZ, false, false, false)
                }

                nativeInvoke('UNLOCK_MINIMAP_ANGLE')
                nativeInvoke('UNLOCK_MINIMAP_POSITION')
            }
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/cinematiccamera', 'toggle', String(e))
        }
    }

    /** Handles flycam toggle events from the server. */
    private onFlycamToggle(): void {
        try {
            if (!state.loggedIn) return
            if (!state.flyMode) this.toggle(true)
            else this.toggle(false)
            mp.events.callRemote('invisible', state.flyMode)
            state.localPlayer.setVisible(!state.flyMode, false)
            state.localPlayer.freezePosition(state.flyMode)
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/cinematiccamera', 'client.flycam', String(e))
        }
    }

    /**
     * Updates movement speed for the fly camera.
     * @param value New movement speed.
     */
    private onSetSpeed(value: number): void {
        try {
            if (!state.loggedIn) return
            if (state.flyMode && this.flycam !== null && !mpAny.game.ui.isPauseMenuActive() && !mp.gui.cursor.visible) {
                this.movementSpeed = value
            }
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/cinematiccamera', 'client.flycam.time', String(e))
        }
    }

    /** Per-frame fly camera update loop. */
    private onRender(): void {
        if (!state.flyMode || this.flycam === null || mpAny.game.ui.isPauseMenuActive() || mp.gui.cursor.visible) return

        const position = state.localPlayer.position
        const rotation = this.flycam.getRot(2)
        const direction = this.flycam.getDirection()
        const m = this.movement
        const t = this.ticks

        // Key release transitions (1 → 2 = start decelerating)
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD4')) && m.left === 1) m.left = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD6')) && m.right === 1) m.right = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD2')) && m.down === 1) m.down = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD8')) && m.up === 1) m.up = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD7')) && m.turnL === 1) m.turnL = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD9')) && m.turnR === 1) m.turnR = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('KEY_W')) && m.w === 1) m.w = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('KEY_S')) && m.s === 1) m.s = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('KEY_A')) && m.a === 1) m.a = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('KEY_D')) && m.d === 1) m.d = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_SPACE')) && m.space === 1) m.space = 2
        if (!mp.keys.isDown(VirtualKeys.toCode('VK_CONTROL')) && m.ctrl === 1) m.ctrl = 2

        // Key press transitions (3 → 1 = start accelerating; opposite key must be idle)
        if (mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD4')) && m.right === 3) m.left = 1
        if (mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD6')) && m.left === 3) m.right = 1
        if (mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD2')) && m.up === 3) m.down = 1
        if (mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD8')) && m.down === 3) m.up = 1
        if (mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD7')) && m.turnR === 3) m.turnL = 1
        if (mp.keys.isDown(VirtualKeys.toCode('VK_NUMPAD9')) && m.turnL === 3) m.turnR = 1
        if (mp.keys.isDown(VirtualKeys.toCode('KEY_S')) && m.w === 3) m.s = 1
        if (mp.keys.isDown(VirtualKeys.toCode('KEY_W')) && m.s === 3) m.w = 1
        if (mp.keys.isDown(VirtualKeys.toCode('KEY_A')) && m.d === 3) m.a = 1
        if (mp.keys.isDown(VirtualKeys.toCode('KEY_D')) && m.a === 3) m.d = 1
        if (mp.keys.isDown(VirtualKeys.toCode('VK_CONTROL')) && m.space === 3) m.ctrl = 1
        if (mp.keys.isDown(VirtualKeys.toCode('VK_SPACE')) && m.ctrl === 3) m.space = 1

        // E/Q adjust movement speed
        if (mp.keys.isDown(VirtualKeys.toCode('KEY_E')) && !mp.keys.isDown(VirtualKeys.toCode('KEY_Q'))) {
            this.movementSpeed += 0.5
            if (this.movementSpeed >= 150.0) this.movementSpeed = 100.0
        }
        if (mp.keys.isDown(VirtualKeys.toCode('KEY_Q')) && !mp.keys.isDown(VirtualKeys.toCode('KEY_E'))) {
            this.movementSpeed -= 0.5
            if (this.movementSpeed <= 0.0) this.movementSpeed = 0.0
        }

        // + / - adjust FOV
        if (mp.keys.isDown(VirtualKeys.toCode('VK_OEM_PLUS'))) {
            this.fov += 0.1
            if (this.fov >= 130.0) this.fov = 130.0
        }
        if (mp.keys.isDown(VirtualKeys.toCode('VK_OEM_MINUS'))) {
            this.fov -= 0.1
            if (this.fov <= 0.0) this.fov = 0.0
        }

        // Mouse look
        const xMag = mp.game.controls.getDisabledControlNormal(0, 1)
        const yMag = mp.game.controls.getDisabledControlNormal(0, 2)
        if (xMag !== 0) rotation.z = rotation.z + (-xMag) * this.mouseSensitivity
        if (yMag !== 0) {
            rotation.x = rotation.x + (-yMag) * this.mouseSensitivity
            if (rotation.x <= -89.0) rotation.x = -89.0
            else if (rotation.x >= 89.0) rotation.x = 89.0
        }

        // LMB = sprint, RMB = creep
        let speed = this.movementSpeed
        if (mp.keys.isDown(VirtualKeys.toCode('VK_LBUTTON'))) speed = 100.0
        if (mp.keys.isDown(VirtualKeys.toCode('VK_RBUTTON'))) speed = 1.5

        // ── Yaw (numpad 4 / 6) ────────────────────────────────────────────
        switch (m.left) {
            case 1: t.left += 0.005 * speed; if (t.left >= 1) t.left = 1; break
            case 2: t.left -= 0.01 * speed; if (t.left <= 0) { t.left = 0; m.left = 3 } break
        }
        switch (m.right) {
            case 1: t.right += 0.005 * speed; if (t.right >= 1) t.right = 1; break
            case 2: t.right -= 0.01 * speed; if (t.right <= 0) { t.right = 0; m.right = 3 } break
        }
        if (t.left > 0 || t.right > 0) {
            const sr = this.flycam.getRot(2)
            if (t.left > 0) rotation.z = CinematicCamera.lerp(sr.z, rotation.z + speed, t.left)
            if (t.right > 0) rotation.z = CinematicCamera.lerp(sr.z, rotation.z - speed, t.right)
        }

        // ── Pitch (numpad 8 / 2) ──────────────────────────────────────────
        switch (m.up) {
            case 1: t.up += 0.005 * speed; if (t.up >= 1) t.up = 1; break
            case 2: t.up -= 0.01 * speed; if (t.up <= 0) { t.up = 0; m.up = 3 } break
        }
        switch (m.down) {
            case 1: t.down += 0.005 * speed; if (t.down >= 1) t.down = 1; break
            case 2: t.down -= 0.01 * speed; if (t.down <= 0) { t.down = 0; m.down = 3 } break
        }
        if (t.up > 0 || t.down > 0) {
            const sr = this.flycam.getRot(2)
            if (t.up > 0) rotation.x = CinematicCamera.lerp(sr.x, rotation.x + speed, t.up)
            if (t.down > 0) rotation.x = CinematicCamera.lerp(sr.x, rotation.x - speed, t.down)
        }

        // ── Roll (numpad 9 / 7) ───────────────────────────────────────────
        switch (m.turnR) {
            case 1: t.turnR += 0.005 * speed; if (t.turnR >= 1) t.turnR = 1; break
            case 2: t.turnR -= 0.01 * speed; if (t.turnR <= 0) { t.turnR = 0; m.turnR = 3 } break
        }
        switch (m.turnL) {
            case 1: t.turnL += 0.005 * speed; if (t.turnL >= 1) t.turnL = 1; break
            case 2: t.turnL -= 0.01 * speed; if (t.turnL <= 0) { t.turnL = 0; m.turnL = 3 } break
        }
        if (t.turnR > 0 || t.turnL > 0) {
            const sr = this.flycam.getRot(2)
            if (t.turnR > 0) rotation.y = CinematicCamera.lerp(sr.y, rotation.y + speed, t.turnR)
            if (t.turnL > 0) rotation.y = CinematicCamera.lerp(sr.y, rotation.y - speed, t.turnL)
        }

        // ── Forward / back (W / S) ────────────────────────────────────────
        switch (m.w) {
            case 1: t.w += 0.005 * speed; if (t.w >= 1) t.w = 1; break
            case 2: t.w -= 0.01 * speed; if (t.w <= 0) { t.w = 0; m.w = 3 } break
        }
        switch (m.s) {
            case 1: t.s += 0.005 * speed; if (t.s >= 1) t.s = 1; break
            case 2: t.s -= 0.01 * speed; if (t.s <= 0) { t.s = 0; m.s = 3 } break
        }

        const fwd = speed / 10
        if (t.w > 0) {
            position.x = CinematicCamera.lerp(position.x, position.x + direction.x * fwd, t.w)
            position.y = CinematicCamera.lerp(position.y, position.y + direction.y * fwd, t.w)
            position.z = CinematicCamera.lerp(position.z, position.z + direction.z * fwd, t.w)
        }
        if (t.s > 0) {
            position.x = CinematicCamera.lerp(position.x, position.x - direction.x * fwd, t.s)
            position.y = CinematicCamera.lerp(position.y, position.y - direction.y * fwd, t.s)
            position.z = CinematicCamera.lerp(position.z, position.z - direction.z * fwd, t.s)
        }

        // ── Strafe (A / D) ────────────────────────────────────────────────
        switch (m.a) {
            case 1: t.a += 0.005 * speed; if (t.a >= 1) t.a = 1; break
            case 2: t.a -= 0.01 * speed; if (t.a <= 0) { t.a = 0; m.a = 3 } break
        }
        switch (m.d) {
            case 1: t.d += 0.005 * speed; if (t.d >= 1) t.d = 1; break
            case 2: t.d -= 0.01 * speed; if (t.d <= 0) { t.d = 0; m.d = 3 } break
        }

        if (t.a > 0) {
            position.x = CinematicCamera.lerp(position.x, position.x + (-direction.y) * fwd, t.a)
            position.y = CinematicCamera.lerp(position.y, position.y + direction.x * fwd, t.a)
        }
        if (t.d > 0) {
            position.x = CinematicCamera.lerp(position.x, position.x - (-direction.y) * fwd, t.d)
            position.y = CinematicCamera.lerp(position.y, position.y - direction.x * fwd, t.d)
        }

        // ── Vertical (Space / Ctrl) ───────────────────────────────────────
        switch (m.space) {
            case 1: t.space += 0.005 * speed; if (t.space >= 1) t.space = 1; break
            case 2: t.space -= 0.005 * speed; if (t.space <= 0) { t.space = 0; m.space = 3 } break
        }
        switch (m.ctrl) {
            case 1: t.ctrl += 0.005 * speed; if (t.ctrl >= 1) t.ctrl = 1; break
            case 2: t.ctrl -= 0.01 * speed; if (t.ctrl <= 0) { t.ctrl = 0; m.ctrl = 3 } break
        }

        if (t.space > 0) position.z = CinematicCamera.lerp(position.z, position.z + fwd, t.space)
        if (t.ctrl > 0) position.z = CinematicCamera.lerp(position.z, position.z - fwd, t.ctrl)

        // Apply transforms
        state.localPlayer.setCoordsNoOffset(position.x, position.y, position.z, false, false, false)
        state.localPlayer.setHeading(rotation.z)

        mp.game.invoke('0x1279E861A329E73F', position.x, position.y)
        mp.game.invoke('0x299FAEBB108AE05B', Math.floor((rotation.z + 360.0) % 360.0))

        this.flycam.setCoord(position.x, position.y, position.z)
        this.flycam.setRot(rotation.x, rotation.y, rotation.z, 2)
        this.flycam.setFov(this.fov)

        mp.game.controls.disableAllControlActions(0)
        mp.game.controls.enableControlAction(0, 199, true)
        mp.game.controls.enableControlAction(0, 200, true)
        mp.game.controls.enableControlAction(0, 20, true)
    }

    /**
     * Linearly interpolates between two values.
     * @param a Start value.
     * @param b End value.
     * @param t Interpolation factor in [0..1].
     * @returns Interpolated value.
     */
    private static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t
    }
}

/** Singleton cinematic camera controller. */
export const cinematicCamera = new CinematicCamera()
