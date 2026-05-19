// Character selection + creation bridge.
//
// Same pattern as auth: CEF -> client -> server, reply -> client -> CEF.
// The server-side gateway is what actually applies position/health/model on
// the player object; the client just relays.

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
	gender: 'MALE' | 'FEMALE'
	appearance: {
		hairId: number
		beardId: number
		eyebrowsId: number
		bodyId: number
		eyesId: number
		lipsId: number
		paletteId: number
		makeupId: number
	} | null
}

interface CharacterReply {
	ok: boolean
	error?: string
	character?: CharacterDto
}

interface CreateCharacterReply {
	ok: boolean
	error?: string
	characterId?: number
}

function emitToCef(eventName: string, ...args: unknown[]): void {
	const payload = [eventName, ...args].map((arg) => JSON.stringify(arg)).join(',')
	executeCef(`window.listernEvent && window.listernEvent(${payload});`)
}

// CEF -> server
mp.events.add('redage.character.select', (characterId: number) => {
	mp.events.callRemote('redage:character:select', characterId)
})

mp.events.add('redage.character.create', (firstname: string, lastname: string, gender: 'MALE' | 'FEMALE') => {
	mp.events.callRemote('redage:character:create', firstname, lastname, gender)
})

// server -> CEF
mp.events.add('redage:character:reply', (reply: CharacterReply) => {
	emitToCef('redage:character:reply', reply)
})

mp.events.add('redage:character:create:reply', (reply: CreateCharacterReply) => {
	emitToCef('redage:character:create:reply', reply)
})
