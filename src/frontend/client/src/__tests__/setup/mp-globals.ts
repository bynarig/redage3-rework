// Minimal stub of the RAGE:MP client globals for unit tests.
// Real mp.* calls are not available in Node — mock only what your tested code needs.
// Extend with additional stubs as more modules get covered by tests.

import { vi } from 'vitest'

// ── gm (RAGE:MP game-manager event bus) ──────────────────────────────────────
const gmStub = {
  events: {
    add: vi.fn(),
    remove: vi.fn(),
    call: vi.fn(),
  },
}
;(globalThis as unknown as Record<string, unknown>).gm = gmStub

// ── nativeInvoke (RAGE:MP runtime native by name) ────────────────────────────
;(globalThis as unknown as Record<string, unknown>).nativeInvoke = vi.fn()

// ── mp (RAGE:MP client API) ───────────────────────────────────────────────────
const playerLocalStub = {
  handle: 1,
  remoteId: 0,
  name: 'TestPlayer',
  position: { x: 0, y: 0, z: 0 },
  dimension: 0,
  vehicle: null,
  isVoiceActive: false,
  type: 'player',
  heading: 0,
  health: 100,
  armour: 0,
  setCoordsNoOffset: vi.fn(),
  setInvincible: vi.fn(),
  freezePosition: vi.fn(),
  setVisible: vi.fn(),
  setHeading: vi.fn(),
  setComponentVariation: vi.fn(),
  setHairColor: vi.fn(),
  setEyeColor: vi.fn(),
  setHeadOverlay: vi.fn(),
  setHeadOverlayColor: vi.fn(),
  getHeading: vi.fn(() => 0),
  getHealth: vi.fn(() => 100),
  getArmour: vi.fn(() => 0),
  isSwimming: vi.fn(() => false),
  isSwimmingUnderWater: vi.fn(() => false),
  isClimbing: vi.fn(() => false),
  getParachuteState: vi.fn(() => -1),
  attachTo: vi.fn(),
  detach: vi.fn(),
} as unknown as PlayerMp

const cameraStub = {
  setActive: vi.fn(),
  destroy: vi.fn(),
  getRot: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
  setRot: vi.fn(),
  getDirection: vi.fn(() => ({ x: 1, y: 0, z: 0 })),
  setCoord: vi.fn(),
  setFov: vi.fn(),
  attachToPedBone: vi.fn(),
  pointAtCoord: vi.fn(),
}

const browserStub = {
  execute: vi.fn(),
  destroy: vi.fn(),
  markAsChat: vi.fn(),
} as unknown as BrowserMp

const mpStub = {
  events: {
    add: vi.fn(),
    remove: vi.fn(),
    addProc: vi.fn(),
    call: vi.fn(),
    callProc: vi.fn(),
    callRemote: vi.fn(),
    callRemoteUnreliable: vi.fn(),
    addDataHandler: vi.fn(),
  },
  game: {
    joaat: vi.fn((model: string) => model.split('').reduce((h, c) => (h + c.charCodeAt(0)) | 0, 0)),
    streaming: {
      hasModelLoaded: vi.fn(() => true),
      requestModel: vi.fn(),
      setModelAsNoLongerNeeded: vi.fn(),
    },
    entity: {
      doesEntityExist: vi.fn(() => true),
    },
    graphics: {
      notify: vi.fn(),
      drawText: vi.fn(),
    },
    controls: {
      isControlPressed: vi.fn(() => false),
      getDisabledControlNormal: vi.fn(() => 0),
      disableAllControlActions: vi.fn(),
      enableControlAction: vi.fn(),
    },
    system: {
      vdist: vi.fn(() => 0),
    },
    vehicle: {
      getDisplayNameFromVehicleModel: vi.fn(() => 'Sultan'),
    },
    cam: {
      getGameplayCamRot: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
      getGameplayCamForwardVector: vi.fn(() => ({ x: 1, y: 0, z: 0 })),
      getGameplayCamCoord: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
      renderScriptCams: vi.fn(),
    },
    gameplay: {
      getGroundZFor3dCoord: vi.fn(() => 5.0),
    },
    ui: {
      isWaypointActive: vi.fn(() => false),
      getFirstBlipInfoId: vi.fn(() => 0),
      doesBlipExist: vi.fn(() => false),
      getBlipInfoIdCoord: vi.fn(() => ({ x: 100, y: 200, z: 0 })),
      isPauseMenuActive: vi.fn(() => false),
    },
    invoke: vi.fn(() => ''),
  },
  keys: {
    isDown: vi.fn(() => false),
    bind: vi.fn(),
    unbind: vi.fn(),
  },
  players: {
    local: playerLocalStub,
    length: 12,
    toArray: vi.fn(() => new Array(12).fill(playerLocalStub)),
    exists: vi.fn(() => true),
    forEachInStreamRange: vi.fn(),
  },
  vehicles: {
    new: vi.fn(),
    exists: vi.fn(() => true),
    forEachInStreamRange: vi.fn(),
    streamed: [] as VehicleMp[],
  },
  cameras: {
    new: vi.fn(() => cameraStub),
  },
  browsers: {
    new: vi.fn(() => browserStub),
  },
  objects: {
    forEachInStreamRangeItems: vi.fn(),
  },
  gui: {
    chat: { push: vi.fn(), show: vi.fn(), activate: vi.fn() },
    cursor: { visible: false, show: vi.fn() },
  },
  Vector3: class {
    x: number; y: number; z: number
    constructor(x: number, y: number, z: number) { this.x = x; this.y = y; this.z = z }
  },
  raycasting: {
    testPointToPoint: vi.fn(() => false),
  },
  trigger: vi.fn(),
  invoke: vi.fn(),
}

;(globalThis as unknown as Record<string, unknown>).mp = mpStub

// Re-export stubs so individual tests can access and reconfigure mocks.
export { mpStub, gmStub, playerLocalStub, cameraStub, browserStub }
