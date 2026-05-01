// Central client-side state.
// Imported directly by any module that needs shared mutable state.
// Never use global.* — this file is the single source of truth.

/**
 * Shared mutable client-side state used by modules and utilities.
 */
export interface ClientState {
	/** Whether the in-game chat input is open */
	chatActive: boolean
	/** Whether the local player has completed login */
	loggedIn: boolean
	/** Direct reference to the local player entity */
	localPlayer: PlayerMp
	/** Admin privilege level; 0 = not an admin */
	pAdmin: number
	/** Whether admin god-mode is active (suppresses invincibility toggle in noclip) */
	adminGm: boolean
	/** Whether the player is currently spectating another player */
	spectating: boolean
	/** Target being spectated; null when not spectating */
	spTarget: PlayerMp | null
	/** Auto-pilot / movement lock active */
	ap: boolean
	/** Whether the cinematic flycam is active */
	flyMode: boolean
	/** Cached passport objects for nearby players */
	passports: unknown[]
	/** Friend list entries */
	friends: unknown[]
	/** Functions registered to keyboard binder */
	binderFunctions: Array<(...args: unknown[]) => void>
}

/**
 * Singleton state container for the client runtime.
 */
export const state: ClientState = {
	chatActive: false,
	loggedIn: false,
	localPlayer: mp.players.local,
	pAdmin: 0,
	adminGm: false,
	spectating: false,
	spTarget: null,
	ap: false,
	flyMode: false,
	passports: [],
	friends: [],
	binderFunctions: [],
}
