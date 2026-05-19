import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mock, when, instance, verify, anything } from 'ts-mockito'
import { antiFlood, wait, loadModel, vdist3 } from '@/src/utils/helpers'
import { mpStub } from '../setup/mp-globals'

// ── vdist3 ────────────────────────────────────────────────────────────────────

describe('vdist3', () => {
  it('returns 0 for identical points', () => {
    expect(vdist3({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 })).toBe(0)
  })

  it('returns 1 for unit step on the x-axis', () => {
    expect(vdist3({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 })).toBeCloseTo(1)
  })

  it('returns sqrt(3) for unit diagonal across all three axes', () => {
    expect(vdist3({ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 })).toBeCloseTo(Math.sqrt(3))
  })

  it('is symmetric', () => {
    const a = { x: 1, y: 2, z: 3 }
    const b = { x: 4, y: 6, z: 8 }
    expect(vdist3(a, b)).toBeCloseTo(vdist3(b, a))
  })

  it('handles negative coordinates', () => {
    expect(vdist3({ x: -1, y: -1, z: -1 }, { x: 1, y: 1, z: 1 })).toBeCloseTo(Math.sqrt(12))
  })
})

// ── antiFlood ────────────────────────────────────────────────────────────────

describe('antiFlood', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('allows the first call immediately', () => {
    expect(antiFlood('test-key', 1000)).toBe(true)
  })

  it('blocks a second call within the cooldown window', () => {
    antiFlood('block-key', 1000)
    expect(antiFlood('block-key', 1000)).toBe(false)
  })

  it('allows a call after the cooldown expires', () => {
    antiFlood('expire-key', 500)
    vi.advanceTimersByTime(501)
    expect(antiFlood('expire-key', 500)).toBe(true)
  })

  it('tracks keys independently', () => {
    antiFlood('a', 1000)
    expect(antiFlood('b', 1000)).toBe(true)
  })
})

// ── wait ─────────────────────────────────────────────────────────────────────

describe('wait', () => {
  it('resolves after the specified delay', async () => {
    vi.useFakeTimers()
    const p = wait(200)
    vi.advanceTimersByTime(200)
    await expect(p).resolves.toBeUndefined()
    vi.useRealTimers()
  })
})

// ── loadModel — using ts-mockito style manual mock ────────────────────────────
// loadModel calls mp.game.streaming.*, which are vi.fn() stubs set up in
// src/__tests__/setup/mp-globals.ts. We reset and reconfigure them per test.

describe('loadModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns true immediately when the model is already loaded', async () => {
    mpStub.game.streaming.hasModelLoaded.mockReturnValue(true)
    await expect(loadModel('prop_barrel_01a')).resolves.toBe(true)
    expect(mpStub.game.streaming.requestModel).not.toHaveBeenCalled()
  })

  it('requests the model when it is not yet loaded', async () => {
    let callCount = 0
    mpStub.game.streaming.hasModelLoaded.mockImplementation(() => {
      callCount++
      return callCount >= 2 // loaded on second poll
    })

    await expect(loadModel('prop_barrel_01a')).resolves.toBe(true)
    expect(mpStub.game.streaming.requestModel).toHaveBeenCalledOnce()
  })

  it('returns false when the model never loads within 5000 ticks', async () => {
    vi.useFakeTimers()
    mpStub.game.streaming.hasModelLoaded.mockReturnValue(false)

    const p = loadModel('non_existent_model')
    // Drain the async queue without real delays
    for (let i = 0; i < 5100; i++) {
      vi.advanceTimersByTime(0)
      await Promise.resolve()
    }
    await expect(p).resolves.toBe(false)
    vi.useRealTimers()
  })
})

// ── ts-mockito example — mocking a class ─────────────────────────────────────
// This shows the Mockito-style API. Use it when testing code that depends on
// a class instance rather than a plain function or module.

interface EventEmitter {
  on(event: string, handler: () => void): void
  emit(event: string): void
  removeAllListeners(): void
}

describe('ts-mockito class mock example', () => {
  it('records and verifies calls on a mocked interface', () => {
    const mockedEmitter = mock<EventEmitter>()
    const handler = vi.fn()

    // Arrange: configure behaviour
    when(mockedEmitter.on(anything(), anything())).thenReturn(undefined)

    // Act: call through the instance (not the mock itself)
    const emitter = instance(mockedEmitter)
    emitter.on('ready', handler)

    // Assert: Mockito-style call verification
    verify(mockedEmitter.on('ready', anything())).once()
  })
})
