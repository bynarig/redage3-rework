import { executeCef } from '@/src/modules/cef'

interface HudPayload {
	serverName?: string
	online?: number
	voiceActive?: boolean
	voiceAvailable?: boolean
}

interface PlayersCollection {
	length?: number
	toArray?: () => unknown[]
}

function emitHudUpdate(payload: HudPayload): void {
	const eventName = JSON.stringify('redage:hud:update')
	const data = JSON.stringify(payload)
	executeCef(`window.listernEvent && window.listernEvent(${eventName}, ${data});`)
}

function readOnlineCount(): number | undefined {
	const players = mp.players as unknown as PlayersCollection
	if (typeof players.length === 'number' && isFinite(players.length)) return Math.max(0, Math.floor(players.length))
	if (typeof players.toArray === 'function') return players.toArray().length
	return undefined
}

function readVoiceActive(): boolean {
	return Boolean(mp.players.local.isVoiceActive)
}

function publishHudSnapshot(): void {
	emitHudUpdate({
		online: readOnlineCount(),
		voiceActive: readVoiceActive(),
		voiceAvailable: true,
	})
}

mp.events.add('redage:hud:update', (payload: HudPayload) => {
	emitHudUpdate(payload)
})

publishHudSnapshot()
setInterval(publishHudSnapshot, 1000)

export {}
