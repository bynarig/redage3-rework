// Customization bridge: relay appearance changes from CEF to the server
// and bubble the reply back.

import { executeCef } from '@/src/modules/cef'

interface Appearance {
	hairId: number
	beardId: number
	eyebrowsId: number
	bodyId: number
	eyesId: number
	lipsId: number
	paletteId: number
	makeupId: number
}

interface CustomizationReply {
	ok: boolean
	error?: string
}

interface SavedPlayerState {
	position: { x: number; y: number; z: number }
	heading: number
	dimension: number
}

interface CustomizationCamera {
	setActive(active: boolean): void
	pointAtCoord?(x: number, y: number, z: number): void
	destroy(): void
}

interface LocalCustomizationPlayer {
	position: { x: number; y: number; z: number }
	heading?: number
	dimension: number
	freezePosition(toggle: boolean): void
	setCoordsNoOffset(x: number, y: number, z: number, xAxis: boolean, yAxis: boolean, zAxis: boolean): void
	setHeading(heading: number): void
	getHeading?(): number
	setComponentVariation?(componentId: number, drawableId: number, textureId: number, paletteId: number): void
	setHairColor?(firstColor: number, secondColor: number): void
	setEyeColor?(id: number): void
	setHeadOverlay?(overlayId: number, index: number, opacity: number, firstColor?: number, secondColor?: number): void
	setHeadOverlayColor?(overlayId: number, colorType: number, firstColor: number, secondColor: number): void
}

const CUSTOMIZATION_POSITION = { x: -2635.406, y: 1894.9324, z: 157.87411, heading: 51 }
let savedState: SavedPlayerState | null = null
let camera: CustomizationCamera | null = null

function emitToCef(eventName: string, ...args: unknown[]): void {
	const payload = [eventName, ...args].map((arg) => JSON.stringify(arg)).join(',')
	executeCef(`window.listernEvent && window.listernEvent(${payload});`)
}

function localPlayer(): LocalCustomizationPlayer {
	return mp.players.local as unknown as LocalCustomizationPlayer
}

function readAppearance(raw: string): Appearance | null {
	try {
		const parsed = JSON.parse(raw) as Partial<Appearance>
		return {
			hairId: numberOrZero(parsed.hairId),
			beardId: numberOrZero(parsed.beardId),
			eyebrowsId: numberOrZero(parsed.eyebrowsId),
			bodyId: numberOrZero(parsed.bodyId),
			eyesId: numberOrZero(parsed.eyesId),
			lipsId: numberOrZero(parsed.lipsId),
			paletteId: numberOrZero(parsed.paletteId),
			makeupId: numberOrZero(parsed.makeupId),
		}
	} catch (_err) {
		return null
	}
}

function numberOrZero(value: unknown): number {
	return typeof value === 'number' && isFinite(value) ? value : 0
}

function finiteOrFallback(value: unknown, fallback: number): number {
	return typeof value === 'number' && isFinite(value) ? value : fallback
}

function readHeading(player: LocalCustomizationPlayer, fallback: number): number {
	if (typeof player.heading === 'number' && isFinite(player.heading)) return player.heading
	if (typeof player.getHeading === 'function') return finiteOrFallback(player.getHeading(), fallback)
	return fallback
}

function setPlayerHeading(player: LocalCustomizationPlayer, heading: number): void {
	if (!isFinite(heading)) return
	player.setHeading(heading)
}

function applyOverlay(player: LocalCustomizationPlayer, overlayId: number, drawableId: number, opacity: number, colorType: number): void {
	if (typeof player.setHeadOverlay === 'function') player.setHeadOverlay(overlayId, drawableId, opacity, 0, 0)
	if (typeof player.setHeadOverlayColor === 'function') player.setHeadOverlayColor(overlayId, colorType, 0, 0)
}

function applyAppearance(appearance: Appearance): void {
	const player = localPlayer()
	if (typeof player.setComponentVariation === 'function') player.setComponentVariation(2, appearance.hairId, 0, 0)
	if (typeof player.setHairColor === 'function') player.setHairColor(0, 0)
	if (typeof player.setEyeColor === 'function') player.setEyeColor(appearance.eyesId)
	applyOverlay(player, 1, appearance.beardId, 1, 1)
	applyOverlay(player, 2, appearance.eyebrowsId, 1, 1)
	applyOverlay(player, 10, appearance.bodyId, 1, 1)
	applyOverlay(player, 8, appearance.lipsId, 1, 2)
	applyOverlay(player, 5, appearance.paletteId, 1, 2)
	applyOverlay(player, 4, appearance.makeupId, 1, 0)
}

function startCustomizationSession(): void {
	const player = localPlayer()
	if (!savedState) {
		savedState = {
			position: { x: player.position.x, y: player.position.y, z: player.position.z },
			heading: readHeading(player, 0),
			dimension: player.dimension,
		}
	}

	player.setCoordsNoOffset(CUSTOMIZATION_POSITION.x, CUSTOMIZATION_POSITION.y, CUSTOMIZATION_POSITION.z, false, false, false)
	setPlayerHeading(player, CUSTOMIZATION_POSITION.heading)
	player.freezePosition(true)

	if (camera) camera.destroy()
	camera = createFrontCamera()
	camera.setActive(true)
	mp.game.cam.renderScriptCams(true, false, 0, true, false)
}

function stopCustomizationSession(): void {
	const player = localPlayer()
	if (camera) {
		camera.setActive(false)
		camera.destroy()
		camera = null
	}
	mp.game.cam.renderScriptCams(false, false, 0, true, false)
	player.freezePosition(false)

	if (savedState) {
		player.setCoordsNoOffset(savedState.position.x, savedState.position.y, savedState.position.z, false, false, false)
		setPlayerHeading(player, savedState.heading)
		savedState = null
	}
}

function createFrontCamera(): CustomizationCamera {
	const headingRad = (CUSTOMIZATION_POSITION.heading * Math.PI) / 180
	const forwardX = -Math.sin(headingRad)
	const forwardY = Math.cos(headingRad)
	const camPos = new mp.Vector3(
		CUSTOMIZATION_POSITION.x + forwardX * 1.6,
		CUSTOMIZATION_POSITION.y + forwardY * 1.6,
		CUSTOMIZATION_POSITION.z + 0.72
	)
	const created = mp.cameras.new('default', camPos, new mp.Vector3(0, 0, 0), 38) as unknown as CustomizationCamera
	if (typeof created.pointAtCoord === 'function') {
		created.pointAtCoord(CUSTOMIZATION_POSITION.x, CUSTOMIZATION_POSITION.y, CUSTOMIZATION_POSITION.z + 0.68)
	}
	return created
}

// CEF -> server. The CEF wizard packages the full Appearance object as a
// JSON string so the mp.callRemote signature stays small and serializable.
mp.events.add('redage.customization.save', (appearanceJson: string) => {
	mp.events.callRemote('redage:customization:save', appearanceJson)
})

mp.events.add('redage.customization.preview', (appearanceJson: string) => {
	const appearance = readAppearance(appearanceJson)
	if (appearance) applyAppearance(appearance)
})

mp.events.add('redage.customization.start', () => {
	startCustomizationSession()
})

mp.events.add('redage.customization.stop', () => {
	stopCustomizationSession()
})

// server -> CEF
mp.events.add('redage:customization:reply', (reply: CustomizationReply) => {
	emitToCef('redage:customization:reply', reply)
})
