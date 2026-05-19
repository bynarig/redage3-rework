import { beforeEach, describe, expect, it, vi } from 'vitest'
import { browserStub, cameraStub, mpStub, playerLocalStub } from '@/src/__tests__/setup/mp-globals'

type Handler = (...args: unknown[]) => void

function registeredHandler(eventName: string): Handler {
    const call = mpStub.events.add.mock.calls.find(([name]) => name === eventName)
    expect(call, `${eventName} should be registered`).toBeDefined()
    return call![1] as Handler
}

describe('customization client bridge', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
        ;(playerLocalStub as unknown as { position: { x: number; y: number; z: number }; heading: number; dimension: number }).position = { x: 10, y: 20, z: 30 }
        ;(playerLocalStub as unknown as { heading: number }).heading = 180
        Object.defineProperty(playerLocalStub, 'dimension', { value: 7, writable: true, configurable: true })
        ;(playerLocalStub.getHeading as ReturnType<typeof vi.fn>).mockReturnValue(180)
    })

    it('forwards appearance saves from CEF to the server', async () => {
        await import('@/src/modules/customization')
        const appearanceJson = JSON.stringify({
            hairId: 1,
            beardId: 2,
            eyebrowsId: 3,
            bodyId: 4,
            eyesId: 5,
            lipsId: 6,
            paletteId: 7,
            makeupId: 8,
        })

        registeredHandler('redage.customization.save')(appearanceJson)

        expect(mpStub.events.callRemote).toHaveBeenCalledWith('redage:customization:save', appearanceJson)
    })

    it('forwards customization replies from the server back into CEF', async () => {
        await import('@/src/modules/customization')

        registeredHandler('browserDomReady')(browserStub)
        registeredHandler('redage:customization:reply')({ ok: true })

        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('redage:customization:reply'))
        expect(browserStub.execute).toHaveBeenCalledWith(expect.stringContaining('"ok":true'))
    })

    it('starts a static front-facing customization camera and restores player state on stop', async () => {
        await import('@/src/modules/customization')

        registeredHandler('redage.customization.start')()

        expect(playerLocalStub.setCoordsNoOffset).toHaveBeenCalledWith(-2635.406, 1894.9324, 157.87411, false, false, false)
        expect(playerLocalStub.setHeading).toHaveBeenCalledWith(51)
        expect(playerLocalStub.freezePosition).toHaveBeenCalledWith(true)
        expect(mpStub.cameras.new).toHaveBeenCalled()
        expect(cameraStub.pointAtCoord).toHaveBeenCalledWith(-2635.406, 1894.9324, 158.55411)
        expect(mpStub.game.cam.renderScriptCams).toHaveBeenCalledWith(true, false, 0, true, false)

        registeredHandler('redage.customization.stop')()

        expect(cameraStub.destroy).toHaveBeenCalled()
        expect(playerLocalStub.freezePosition).toHaveBeenCalledWith(false)
        expect(playerLocalStub.setCoordsNoOffset).toHaveBeenLastCalledWith(10, 20, 30, false, false, false)
        expect(playerLocalStub.setHeading).toHaveBeenLastCalledWith(180)
        expect((playerLocalStub as unknown as { dimension: number }).dimension).toBe(7)
        expect(mpStub.game.cam.renderScriptCams).toHaveBeenCalledWith(false, false, 0, true, false)
    })

    it('does not assign to read-only RAGE entity properties during cleanup', async () => {
        Object.defineProperty(playerLocalStub, 'dimension', { value: 9, writable: false, configurable: true })

        await import('@/src/modules/customization')

        registeredHandler('redage.customization.start')()
        expect(() => registeredHandler('redage.customization.stop')()).not.toThrow()
        expect((playerLocalStub as unknown as { dimension: number }).dimension).toBe(9)
    })

    it('restores heading from getHeading when the runtime heading property is not numeric', async () => {
        ;(playerLocalStub as unknown as { heading: unknown }).heading = undefined
        ;(playerLocalStub.getHeading as ReturnType<typeof vi.fn>).mockReturnValue(222)

        await import('@/src/modules/customization')

        registeredHandler('redage.customization.start')()
        registeredHandler('redage.customization.stop')()

        expect(playerLocalStub.setHeading).toHaveBeenLastCalledWith(222)
    })

    it('applies local preview changes without waiting for the server', async () => {
        await import('@/src/modules/customization')

        registeredHandler('redage.customization.preview')(JSON.stringify({
            hairId: 1,
            beardId: 2,
            eyebrowsId: 3,
            bodyId: 4,
            eyesId: 5,
            lipsId: 6,
            paletteId: 7,
            makeupId: 8,
        }))

        expect(playerLocalStub.setComponentVariation).toHaveBeenCalledWith(2, 1, 0, 0)
        expect(playerLocalStub.setHairColor).toHaveBeenCalledWith(0, 0)
        expect(playerLocalStub.setEyeColor).toHaveBeenCalledWith(5)
        expect(playerLocalStub.setHeadOverlay).toHaveBeenCalledWith(1, 2, 1, 0, 0)
        expect(playerLocalStub.setHeadOverlay).toHaveBeenCalledWith(2, 3, 1, 0, 0)
        expect(playerLocalStub.setHeadOverlay).toHaveBeenCalledWith(10, 4, 1, 0, 0)
        expect(playerLocalStub.setHeadOverlay).toHaveBeenCalledWith(8, 6, 1, 0, 0)
        expect(playerLocalStub.setHeadOverlay).toHaveBeenCalledWith(5, 7, 1, 0, 0)
        expect(playerLocalStub.setHeadOverlay).toHaveBeenCalledWith(4, 8, 1, 0, 0)
    })
})
