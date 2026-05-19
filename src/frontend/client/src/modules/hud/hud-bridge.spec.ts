import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { browserStub, mpStub, playerLocalStub } from '@/src/__tests__/setup/mp-globals'

type Handler = (...args: unknown[]) => void

function registeredHandler(eventName: string): Handler {
    const call = mpStub.events.add.mock.calls.find(([name]) => name === eventName)
    expect(call, `${eventName} should be registered`).toBeDefined()
    return call![1] as Handler
}

describe('hud client bridge', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.resetModules()
        vi.clearAllMocks()
        mpStub.players.length = 12
        ;(playerLocalStub as unknown as { isVoiceActive: boolean }).isVoiceActive = false
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('publishes online count and voice state to CEF', async () => {
        await import('@/src/modules/cef')
        registeredHandler('browserDomReady')(browserStub)

        await import('@/src/modules/hud')

        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('redage:hud:update'))
        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('"online":12'))
        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('"voiceActive":false'))
    })

    it('refreshes voice state every second', async () => {
        await import('@/src/modules/cef')
        registeredHandler('browserDomReady')(browserStub)
        await import('@/src/modules/hud')
        vi.clearAllMocks()

        ;(playerLocalStub as unknown as { isVoiceActive: boolean }).isVoiceActive = true
        vi.advanceTimersByTime(1000)

        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('"voiceActive":true'))
    })

    it('forwards server HUD updates to CEF', async () => {
        await import('@/src/modules/cef')
        registeredHandler('browserDomReady')(browserStub)
        await import('@/src/modules/hud')

        registeredHandler('redage:hud:update')({ serverName: 'RedAge UA', online: 77 })

        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('"serverName":"RedAge UA"'))
        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('"online":77'))
    })
})
