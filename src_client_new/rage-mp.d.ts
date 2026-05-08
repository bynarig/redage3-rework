// Augment RAGE MP client-side globals not covered by @ragempcommunity/types-client
// or used via the project's own patterns (gm.events, rpc, global.*).

// ── Gamemode event system (gm.events) ─────────────────────────────────────────
// The gamemode wraps mp.events into gm.events.add for convenience.
declare const gm: {
  events: {
    add(eventName: string, handler: (...args: unknown[]) => void): void
    remove(eventName: string): void
    call(eventName: string, ...args: unknown[]): void
  }
}

// ── rage-rpc bridge ───────────────────────────────────────────────────────────
declare const rpc: {
  register(procedureName: string, handler: (...args: unknown[]) => unknown): void
  unregister(procedureName: string): void
  call(procedureName: string, ...args: unknown[]): Promise<unknown>
  callServer(procedureName: string, ...args: unknown[]): Promise<unknown>
  callBrowsers(procedureName: string, ...args: unknown[]): Promise<unknown>
}

// // ── Project-specific globals set in index.ts ─────────────────────────────────
// declare global {
//   var loggedin: boolean
//   var lastCheck: number
//   var chatActive: boolean
//   var editing: boolean
//   var freeze: boolean
//   var pocketEnabled: boolean
//   var esptoggle: number
//   var localplayer: PlayerMp
//   var soundApi: Record<string, unknown>
//   var passports: unknown[]
//   var friends: string[]
//   var pAdmin: number
//   var spectating: boolean
//   var sptarget: PlayerMp | null
//   var ap: boolean
//   var isEditor: boolean
//   var isDemorgan: boolean
//   var isSeat: boolean
//   var isSartMetro: boolean
//   var ANTIANIM: boolean
//   var dropEditor: boolean
//   var isEnter: string | undefined
//   var VehicleSeatFix: number
//   var lastCheckKeyToEvents: number
//   var canHackAirdrop: boolean
//   var canHackMatWarDrop: boolean
//   var selectFestive: { fId: number } | number | undefined
//   var selectFightId: number | undefined
//   var selectMatwarFightId: number | undefined
//   var selectBear: unknown | undefined
//   var dfdayMissionCanPress: boolean
//   var horsesplaying: boolean
//   var rouletteplay: boolean
//   var Petrol: number | undefined
//   var userBinder: Array<{ keyCode: number }>
//   var antiFlood: (name: string, time: number) => boolean
//   var binderFunctions: Record<string, () => void> & unknown[]
//   var renderName: Record<string, string>
//   var escapeHtml: (str: string) => string
//   var loadModel: (model: string | number) => Promise<boolean>
//   var isAttached: (entity: EntityMp) => Promise<boolean>
//   var wait: (ms: number) => Promise<void>
//   var Keys: Record<string, number>
//   var menuCheck: () => boolean
//   var menuOpen: () => void
//   var setStartCam: () => void
//   var RAYCASTING_FLAGS: {
//     map: number
//     vehicles: number
//     players: number
//     players2: number
//     objects: number
//     vegetation: number
//   }
//   var Natives: Record<string, (...args: unknown[]) => unknown>
//   var requestAnimDict: (dict: string) => Promise<void>
//   var translateText: (text: string) => string
//   var blackjack: { selectTable: unknown }
// }
