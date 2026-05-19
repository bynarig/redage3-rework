import { state } from '../../state'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Untyped RAGE:MP APIs not covered by client typings.
 */
const mpAny = mp as any

/**
 * Color map by fraction id.
 */
const FRACTION_COLORS: Record<number, RGBA> = {
    1:  [34,  139, 34,  255],
    2:  [186, 85,  211, 255],
    3:  [240, 230, 140, 255],
    4:  [65,  105, 225, 255],
    5:  [255, 82,  82,  255],
    6:  [173, 255, 47,  255],
    7:  [0,   0,   255, 255],
    8:  [247, 69,  132, 255],
    9:  [0,   0,   255, 255],
    10: [186, 155, 0,   255],
    11: [10,  127, 140, 255],
    12: [139, 0,   0,   255],
    13: [169, 169, 169, 255],
    14: [139, 69,  19,  255],
    15: [255, 145, 0,   255],
    18: [0,   0,   255, 255],
}

/** Text render options for player labels. */
const DRAW_OPTS_PLAYER = { scale: [0.3, 0.3] as Array2d, outline: true, font: 4 }
/** Text render options for vehicle labels. */
const DRAW_OPTS_VEHICLE = { scale: [0.3, 0.3] as Array2d, outline: true, color: [255, 255, 255, 150] as RGBA, font: 4 }
/** Text render options for object labels. */
const DRAW_OPTS_OBJECT  = { scale: [0.3, 0.3] as Array2d, outline: true, color: [196, 196, 196, 255] as RGBA, font: 4 }
/** Text render options for ESP error messages. */
const DRAW_OPTS_ERROR   = { scale: [0.35, 0.35] as Array2d, outline: true, color: [255, 255, 255, 185] as RGBA, font: 0 }

/**
 * Admin ESP renderer (players, vehicles, and objects).
 */
class Esp {
    private espMode = 0

    /** Wires ESP event handlers. */
    constructor() {
        gm.events.add('setEspState', (...args: unknown[]) => this.onSetState(args[0] as number))
        gm.events.add('CheckMyVList', () => this.onCheckVoiceList())
        gm.events.add('render', () => this.onRender())
    }

    /** Cycles the current ESP mode and persists it to the server. */
    toggle(): void {
        try {
            if (!state.loggedIn || state.chatActive || state.pAdmin === 0) return
            this.espMode = this.espMode >= 4 ? 0 : this.espMode + 1
            this.showModeNotification(this.espMode)
            mp.events.callRemote('saveEspState', this.espMode)
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/esp', 'binderFunctions', String(e))
        }
    }

    /**
     * Updates the local ESP mode from the server.
     * @param mode New ESP mode.
     */
    private onSetState(mode: number): void {
        try {
            this.espMode = mode
            this.showModeNotification(mode)
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/esp', 'setEspState', String(e))
        }
    }

    /** Logs active voice users in range. */
    private onCheckVoiceList(): void {
        try {
            mp.gui.chat.push('=== VOICE LIST ===')
            mp.players.forEachInStreamRange((player) => {
                if (player.isVoiceActive) mp.gui.chat.push(`[${player.remoteId}] ${player.name}`)
            })
            mp.gui.chat.push('=== VOICE LIST ===')
        } catch (e: unknown) {
            mp.events.callRemote('client_trycatch', 'admin/esp', 'CheckMyVList', String(e))
        }
    }

    /** Per-frame render callback for ESP overlays. */
    private onRender(): void {
        if (!state.loggedIn || state.pAdmin === 0 || this.espMode === 0) return

        const localPos = state.localPlayer.position

        if (this.espMode === 1 || this.espMode === 3) {
            mp.players.forEachInStreamRange((player) => {
                if (player.handle === 0 || player === state.localPlayer) return
                try {
                    const pos = player.position
                    const playerAdminLvl: number = Number((player as unknown as Record<string, unknown>)['ALVL']) || 0
                    if (state.pAdmin !== 9 && state.pAdmin < playerAdminLvl) return

                    if (player.isVoiceActive) {
                        mp.game.graphics.drawText('VOICE', [pos.x, pos.y, pos.z + 1.8], {
                            ...DRAW_OPTS_PLAYER,
                            color: [0, 255, 0, 255],
                        })
                    }

                    const fractionId = (player as unknown as Record<string, unknown>)['fraction'] as number
                    let color: RGBA = playerAdminLvl > 0
                        ? [255, 0, 0, 255]
                        : (FRACTION_COLORS[fractionId] || [255, 255, 255, 255])

                    const dist = Math.round(mp.game.system.vdist(pos.x, pos.y, pos.z, localPos.x, localPos.y, localPos.z))
                    const tag = `${player.name} (${player.remoteId})\n${dist} M | ${player.getHealth()} HP | ${player.getArmour()} AR`

                    mp.game.graphics.drawText(tag, [pos.x, pos.y, pos.z + 1.5], { ...DRAW_OPTS_PLAYER, color })
                } catch {
                    mp.game.graphics.drawText(
                        `[ESP-ERROR] Cant render player ${player.name} (${player.remoteId})`,
                        [0.20, 0.75],
                        DRAW_OPTS_ERROR
                    )
                }
            })
        }

        if (this.espMode === 2 || this.espMode === 3) {
            mp.vehicles.forEachInStreamRange((vehicle) => {
                if (vehicle.handle === 0 || vehicle === state.localPlayer.vehicle) return
                const pos = vehicle.position
                const dist = Math.round(mp.game.system.vdist(pos.x, pos.y, pos.z, localPos.x, localPos.y, localPos.z))
                try {
                    const name  = mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model)
                    const plate = vehicle.getNumberPlateText()
                    const hp    = Math.floor(vehicle.getEngineHealth())
                    const kmh   = Math.floor(vehicle.getSpeed() * 3.6)
                    mp.game.graphics.drawText(
                        `${name} (${vehicle.remoteId}) | ${plate}\n${dist} M | ${hp} HP | ${kmh} KMH`,
                        [pos.x, pos.y, pos.z - 0.5],
                        DRAW_OPTS_VEHICLE
                    )
                } catch {
                    mp.game.graphics.drawText(
                        `${mp.game.vehicle.getDisplayNameFromVehicleModel(vehicle.model)} (${vehicle.remoteId})\n${dist} M`,
                        [pos.x, pos.y, pos.z - 0.5],
                        DRAW_OPTS_VEHICLE
                    )
                }
            })
        }

        if (this.espMode === 4) {
            mpAny.objects.forEachInStreamRangeItems((object: ObjectMp) => {
                if (!object || !object.doesExist() || object.type !== 'object') return
                const pos = object.position
                const dist = mp.game.system.vdist(pos.x, pos.y, pos.z, localPos.x, localPos.y, localPos.z)
                if (dist >= 100) return
                try {
                    const obj = object as unknown as Record<string, unknown>
                    const distRound = Math.round(dist)
                    if (obj['dropData']) {
                        mp.game.graphics.drawText(
                            `Item (${object.remoteId})\n${object.model} | ${distRound} M`,
                            [pos.x, pos.y, pos.z - 0.1],
                            DRAW_OPTS_OBJECT
                        )
                    } else if (object.getVariable('furniture')) {
                        mp.game.graphics.drawText(
                            `Furniture\n${object.model} | ${distRound} M`,
                            [pos.x, pos.y, pos.z - 0.1],
                            DRAW_OPTS_OBJECT
                        )
                    }
                } catch {
                    mp.game.graphics.drawText('[ESP-ERROR] Cant render object', [pos.x, pos.y, pos.z - 0.1], DRAW_OPTS_OBJECT)
                }
            })
        }
    }

    /**
     * Shows an on-screen notification for the current mode.
     * @param mode Current ESP mode.
     */
    private showModeNotification(mode: number): void {
        const labels: Record<number, string> = {
            0: 'ESP: ~r~Disabled',
            1: 'ESP: ~g~Only Players',
            2: 'ESP: ~g~Only Vehicles',
            3: 'ESP: ~g~Players & Vehicles',
            4: 'ESP: ~g~Furniture & Items',
        }
        if (mode in labels) mp.game.graphics.notify(labels[mode] as string)
    }
}

/** Singleton ESP instance. */
export const esp = new Esp()
