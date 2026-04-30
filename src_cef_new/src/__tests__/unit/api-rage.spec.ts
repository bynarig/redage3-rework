import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mock, when, instance, verify, anything } from 'ts-mockito'

// ── executeClient / executeClientAsync ────────────────────────────────────────

describe('api/rage', () => {
  beforeEach(() => {
    ;(window as any).mp = undefined
  })

  it('executeClient does nothing when mp is not available', async () => {
    const { executeClient } = await import('@/api/rage')
    expect(() => executeClient('some.event', 1, 2)).not.toThrow()
  })

  it('executeClient calls mp.trigger when mp is available', async () => {
    const trigger = vi.fn()
    ;(window as any).mp = { trigger }

    const { executeClient } = await import('@/api/rage')
    executeClient('client.test', 42)

    expect(trigger).toHaveBeenCalledWith('client.test', 42)
  })

  it('executeClientAsync resolves to null without mp', async () => {
    const { executeClientAsync } = await import('@/api/rage')
    const result = await executeClientAsync('client.async')
    expect(result).toBeNull()
  })
})

// ── ts-mockito example with a real service interface ─────────────────────────

interface CefBridgeService {
  sendToClient(event: string, payload: unknown): void
  receiveFromClient(event: string, handler: (data: unknown) => void): void
}

describe('ts-mockito: CefBridgeService', () => {
  it('stubs and verifies sendToClient', () => {
    const mockedBridge = mock<CefBridgeService>()
    when(mockedBridge.sendToClient(anything(), anything())).thenReturn(undefined)

    const bridge = instance(mockedBridge)
    bridge.sendToClient('player.update', { health: 80 })

    verify(mockedBridge.sendToClient('player.update', anything())).once()
  })

  it('verifies that receiveFromClient is never called when not needed', () => {
    const mockedBridge = mock<CefBridgeService>()
    const bridge = instance(mockedBridge)

    bridge.sendToClient('ping', null)

    verify(mockedBridge.receiveFromClient(anything(), anything())).never()
  })
})
