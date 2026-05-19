import { beforeEach, describe, expect, it, vi } from 'vitest'
import { browserStub, mpStub } from '@/src/__tests__/setup/mp-globals'

type Handler = (...args: unknown[]) => void

function registeredHandler(eventName: string): Handler {
    const call = mpStub.events.add.mock.calls.find(([name]) => name === eventName)
    expect(call, `${eventName} should be registered`).toBeDefined()
    return call![1] as Handler
}

describe('character client bridge', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
    })

    it('opens the root CEF package that RAGE:MP loads', async () => {
        await import('@/src/modules/character')

        expect(mpStub.browsers.new).toHaveBeenCalledWith('package://interface/index.html')
    })

    it('forwards character creation requests from CEF to the server', async () => {
        await import('@/src/modules/character')

        registeredHandler('redage.character.create')('John', 'Stone', 'MALE')

        expect(mpStub.events.callRemote).toHaveBeenCalledWith('redage:character:create', 'John', 'Stone', 'MALE')
    })

    it('forwards character creation replies from the server back into CEF', async () => {
        await import('@/src/modules/character')

        registeredHandler('browserDomReady')(browserStub)
        registeredHandler('redage:character:create:reply')({ ok: true, characterId: 7 })

        expect(browserStub.execute).toHaveBeenCalledWith(
            expect.stringContaining('redage:character:create:reply')
        )
        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('"characterId":7'))
    })
})
