// Central client-side state.
// Imported directly by any module that needs shared mutable state.
// Never use global.* — this file is the single source of truth.

export interface ClientState {
  /** Whether the in-game chat input is open */
  chatActive: boolean
  /** Whether the local player has completed login */
  loggedin: boolean
  /** Direct reference to the local player entity */
  localplayer: PlayerMp
  /** Admin privilege level; 0 = not an admin */
  pAdmin: number
  /** Whether the player is currently spectating another player */
  spectating: boolean
  /** Target being spectated; null when not spectating */
  sptarget: PlayerMp | null
  /** Auto-pilot / movement lock active */
  ap: boolean
  /** Cached passport objects for nearby players */
  passports: unknown[]
  /** Friend list entries */
  friends: unknown[]
  /** Functions registered to keyboard binder */
  binderFunctions: Array<(...args: unknown[]) => void>
}

export const state: ClientState = {
  chatActive: false,
  loggedin: false,
  localplayer: mp.players.local,
  pAdmin: 0,
  spectating: false,
  sptarget: null,
  ap: false,
  passports: [],
  friends: [],
  binderFunctions: [],
}
