import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mock, when, instance, verify, anything } from 'ts-mockito'
import { antiFlood, escapeHtml, wait, loadModel } from '@/src/utils/helpers'
import { mpStub } from '../setup/mp-globals'

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

// ── escapeHtml ───────────────────────────────────────────────────────────────

describe('escapeHtml', () => {
  it.each([
    ['&', '&amp;'],
    ['<', '&lt;'],
    ['>', '&gt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
    ['`', '&#x60;'],
    ['=', '&#x3D;'],
    ['/', '&#x2F;'],
  ])('escapes %s → %s', (input, expected) => {
    expect(escapeHtml(input)).toBe(expected)
  })

  it('leaves safe characters unchanged', () => {
    expect(escapeHtml('Hello world 123')).toBe('Hello world 123')
  })

  it('escapes a full XSS payload', () => {
    expect(escapeHtml('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;',
    )
  })

  it('coerces non-string values', () => {
    expect(escapeHtml(42)).toBe('42')
    expect(escapeHtml(null)).toBe('null')
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
