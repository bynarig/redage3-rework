// Client-side entry point.
//
// Only imports modules that contain real implementations.
// Stub-only modules are not wired in until they are actually migrated.
//
// State is managed via src/state.ts — no global.* assignments.
// Utilities are pure functions in src/utils/helpers.ts.
// Each module imports what it needs directly:
//
//   import { state }         from '@/src/state'
//   import { antiFlood }     from '@/src/utils/helpers'
//   import { translateText } from '@/src/lang'
//   import { Keys }          from '@/src/modules/constants/keys'

import { state } from '@/src/state'
import { translateText } from '@/src/lang'
// import { Keys } from '@/src/modules/constants/keys'
import { antiFlood, loadModel, wait, RAYCASTING_FLAGS } from '@/src/utils/helpers'

// One-time startup side-effect carried over from legacy initialization.
state.localPlayer.freezePosition(false)

// ─── Server bridge modules ────────────────────────────────────────────────────
// These wire CEF UI events to the new JS serverside (gateway -> Kafka -> services).
// They are pure side-effect imports — each module registers its own mp.events handlers.
import '@/src/modules/system-controls'
import '@/src/modules/cef'
import '@/src/modules/hud'
import '@/src/modules/auth'
import '@/src/modules/character'
import '@/src/modules/customization'

// ─── Not yet migrated ──────────────────────────────────────────────────────────
// The modules below exist as empty stubs (see src/modules/).
// Uncomment each line once the module has an actual TypeScript implementation.
//
// import '@/src/configs/natives'
// import '@/src/utils'
// import '@/src/debug'
// import '@/src/modules/constants/controls'
// import '@/src/modules/camera'
// import '@/src/modules/animation'
// import '@/src/modules/admin'
// import '@/src/modules/inventory'
// import '@/src/modules/player'
// import '@/src/modules/business'
// import '@/src/modules/vehicles'
// import '@/src/modules/fractions'
// import '@/src/modules/house'
// import '@/src/modules/world'
// import '@/src/modules/casino'
// import '@/src/modules/synchronization'
// import '@/src/modules/shop'
// import '@/src/modules/events'
// import '@/src/modules/polygons'
// import '@/src/modules/phone'
// import '@/src/modules/battlepass'

// export { state, translateText, antiFlood, loadModel, wait, RAYCASTING_FLAGS }
