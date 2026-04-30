// Minimal stub of the RAGE:MP client globals for unit tests.
// Real mp.* calls are not available in Node — mock only what your tested code needs.
// Extend with additional stubs as more modules get covered by tests.

import { vi } from 'vitest'

const mpStub = {
  events: {
    add: vi.fn(),
    remove: vi.fn(),
    addProc: vi.fn(),
    call: vi.fn(),
    callProc: vi.fn(),
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
  },
  players: {
    local: {
      handle: 0,
      position: { x: 0, y: 0, z: 0 },
      heading: 0,
      health: 100,
      armour: 0,
    } as unknown as PlayerMp,
  },
  vehicles: {
    new: vi.fn(),
  },
  trigger: vi.fn(),
  invoke: vi.fn(),
}

;(globalThis as unknown as Record<string, unknown>).mp = mpStub

// Re-export the stub so individual tests can access and reset mocks.
export { mpStub }
