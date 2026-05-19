// Auth bridge: CEF UI <-> client <-> RAGE:MP server (gateway).
//
// Flow:
//   1. CEF triggers `redage.auth.login` (or `redage.auth.register`) via mp.trigger.
//   2. We forward to the server as `redage:auth:login` / `redage:auth:register`.
//   3. Server (gateway) does Kafka RPC against auth-service, then calls
//      `redage:auth:reply` back on this player.
//   4. We bubble the reply up to the CEF UI via the legacy `listernEvent`
//      bridge so CEF composables can subscribe with `addListernEvent`.

import { state } from '@/src/state'
import { executeCef } from '@/src/modules/cef'

interface AccountSummary {
	id: number
	login: string
	characters: number[]
	vipLevel: number
	donutCurrency: number
}

interface AuthReply {
	ok: boolean
	error?: string
	account?: AccountSummary
}

function emitToCef(eventName: string, ...args: unknown[]): void {
	// CEF subscribers register via window.functionList — we wake them up by
	// invoking `listernEvent` inside the embedded browser context.
	const payload = [eventName, ...args].map((arg) => JSON.stringify(arg)).join(',')
	executeCef(`window.listernEvent && window.listernEvent(${payload});`)
}

mp.events.add('redage.auth.login', (login: string, password: string) => {
	mp.events.callRemote('redage:auth:login', login, password)
})

mp.events.add('redage.auth.register', (login: string, email: string, password: string) => {
	mp.events.callRemote('redage:auth:register', login, email, password)
})

mp.events.add('redage:auth:reply', (reply: AuthReply) => {
	if (reply.ok && reply.account) {
		state.loggedIn = true
	}
	emitToCef('redage:auth:reply', reply)
})
