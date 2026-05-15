import { state } from '../../state'
import { antiFlood, vdist3 } from '../../utils/helpers'

/**
 * Vehicle anti-cheat tracking data.
 */
interface VehicleAcData {
    lastCoords: Vector3
    lastSpeed: number
    lastDist: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Untyped RAGE:MP APIs not covered by client typings.
 */
const mpAny = mp as any

/**
 * Client-side anti-cheat checks for teleport, noclip, and vehicle physics.
 */
class AntiCheat {
    private readonly player: PlayerMp = mp.players.local
    private disableCounter: number = 0

    private lastPosition: Vector3 = new mp.Vector3(0, 0, 0)
    private lastDimension: number = 0
    private lastTime: number = 0
    private spawnTime: number = 0
    private noclipCount: number = 0
    private vehiclesControl: Map<VehicleMp, VehicleAcData> = new Map()
    private gravityCount: number = 0

    /** Wires anti-cheat timers and spawn hooks. */
    constructor() {
        setInterval(() => this.tick(), 250)

        gm.events.add('playerSpawn', (player) => {
            if (player === this.player) this.spawnTime = Date.now()
        })
    }

    /** Send a server event unless checks are temporarily disabled. */
    private callRemote(event: string, ...args: unknown[]): void {
        if (this.disableCounter === 0) mp.events.callRemoteUnreliable(event, ...args)
    }

    /** Periodic anti-cheat tick. */
    private tick(): void {
        if (state.pAdmin > 0 || !state.loggedIn) return

        const time = Date.now()
        const position = this.player.position
        const dimension = this.player.dimension
        const vehicle = this.player.vehicle

        if (dimension !== this.lastDimension) {
            this.lastTime = time
            this.lastPosition = position
            this.lastDimension = dimension
            return
        }

        const dx2 = position.x - this.lastPosition.x, dy2 = position.y - this.lastPosition.y
        const dist = Math.sqrt(dx2 * dx2 + dy2 * dy2)

        if (
            dimension === 0 &&
            dist >= 650 &&
            time - this.lastTime > 10000 &&
            time - this.spawnTime > 2500 &&
            antiFlood('s_ac_teleport', 25000)
        ) {
            const from = mpAny.api.location.getZoneName(this.lastPosition.x, this.lastPosition.y, this.lastPosition.z)
            const to = mpAny.api.location.getZoneName(position.x, position.y, position.z)
            this.callRemote('s_ac_teleport', `${from} - ${to} - ${Math.round(dist)}m`)
            return
        }

        const groundZ: number = mpAny.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z + 3, 0, false)

        if (
            dimension === 0 &&
            (dist > 25 || Math.abs(this.lastPosition.z - position.z) < 1) &&
            !mp.raycasting.testPointToPoint(position, new mp.Vector3(position.x, position.y, position.z - 10), this.player.handle, 17) &&
            Math.abs(position.z - groundZ) > 10 &&
            !mp.raycasting.testPointToPoint(new mp.Vector3(position.x + 1, position.y, position.z), new mp.Vector3(position.x + 1, position.y, position.z - 10), this.player.handle, 17) &&
            !mp.raycasting.testPointToPoint(new mp.Vector3(position.x - 1, position.y, position.z), new mp.Vector3(position.x - 1, position.y, position.z - 10), this.player.handle, 17) &&
            !mp.raycasting.testPointToPoint(new mp.Vector3(position.x, position.y + 1, position.z), new mp.Vector3(position.x, position.y + 1, position.z - 10), this.player.handle, 17) &&
            !mp.raycasting.testPointToPoint(new mp.Vector3(position.x, position.y - 1, position.z), new mp.Vector3(position.x, position.y - 1, position.z - 10), this.player.handle, 17)
        ) {
            const nearAircraft = (() => {
                let found = false
                mp.vehicles.forEachInStreamRange((v) => {
                    if (!found && v.getClass() === 14 && vdist3(position, v.position) < 15) found = true
                })
                return found
            })()

            if (
                !this.player.isSwimming() &&
                !this.player.isSwimmingUnderWater() &&
                !this.player.isClimbing() &&
                !(vehicle !== null && [14, 15, 16, 17, 18, 19, 20].includes(vehicle.getClass())) &&
                !nearAircraft &&
                ![0, 1, 2].includes(this.player.getParachuteState())
            ) {
                this.noclipCount += 1
            }

            if (this.noclipCount > 15 && antiFlood('s_ac_noclip', 10000)) {
                this.callRemote('s_ac_noclip')
                return
            }
        } else {
            this.noclipCount = 0
        }

        if (dimension === 0) {
            if (vehicle) {
                this.vehiclesControl.clear()
            } else {
                const streamed = mp.vehicles.streamed.filter((v) => v.controller === this.player)

                for (const [v] of this.vehiclesControl) {
                    if (!mp.vehicles.exists(v) || v.handle === 0 || v.controller !== this.player)
                        this.vehiclesControl.delete(v)
                }

                for (const v of streamed) {
                    if (!this.vehiclesControl.has(v)) {
                        this.vehiclesControl.set(v, {
                            lastCoords: v.getCoords(true),
                            lastSpeed: v.getSpeed(),
                            lastDist: 0,
                        })
                    } else {
                        const data = this.vehiclesControl.get(v)!
                        const vehiclePosition = v.getCoords(true)
                        const vehicleSpeed = v.getSpeed()
                        const vehicleDist = vdist3(vehiclePosition, data.lastCoords)
                        const diffSpeed = Math.abs(vehicleSpeed - data.lastSpeed)

                        if (diffSpeed > 110) {
                            if (antiFlood('s_ac_veh_gravity', 600000)) this.callRemote('s_ac_veh_gravity', v)
                        } else {
                            if (vehicleSpeed < 1 && vehicleDist > 1) {
                                if (++this.gravityCount > 10 && antiFlood('s_ac_veh_gravity', 600000))
                                    this.callRemote('s_ac_veh_gravity', v)
                            } else {
                                this.gravityCount = 0
                            }

                            data.lastCoords = vehiclePosition
                            data.lastSpeed = vehicleSpeed
                            data.lastDist = vehicleDist
                        }
                    }
                }
            }
        }

        this.lastPosition = position
        this.lastDimension = dimension
    }
}

/** Singleton anti-cheat controller. */
export const antiCheat = new AntiCheat()
