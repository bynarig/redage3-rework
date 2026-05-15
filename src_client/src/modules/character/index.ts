// Character selection bridge.
//
// Same pattern as auth: CEF -> client -> server, reply -> client -> CEF.
// The server-side gateway is what actually applies position/health on the
// player object; the client just relays.

import { executeCef } from '@/src/modules/cef'

interface CharacterDto {
	id: number
	name: string
	cash: number
	bank: number
	position: { x: number; y: number; z: number; heading: number }
	health: number
	armor: number
	dimension: number
}

interface CharacterReply {
	ok: boolean
	error?: string
	character?: CharacterDto
}

function emitToCef(eventName: string, ...args: unknown[]): void {
	const payload = [eventName, ...args].map((arg) => JSON.stringify(arg)).join(',')
	executeCef(`window.listernEvent && window.listernEvent(${payload});`)
}

mp.events.add('redage.character.select', (characterId: number) => {
	mp.events.callRemote('redage:character:select', characterId)
})

mp.events.add('redage:character:reply', (reply: CharacterReply) => {
	emitToCef('redage:character:reply', reply)
})
