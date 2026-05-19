import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mpStub } from '@/src/__tests__/setup/mp-globals'

type Handler = () => void

function boundHandler(keyCode: number): Handler {
    const call = mpStub.keys.bind.mock.calls.find(([code]) => code === keyCode)
    expect(call, `key ${keyCode} should be bound`).toBeDefined()
    return call![2] as Handler
}

describe('system controls', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.clearAllMocks()
        mpStub.gui.cursor.visible = false
    })

    it('deactivates the built-in RAGE chat on startup', async () => {
        await import('@/src/modules/system-controls')

        expect(mpStub.gui.chat.show).toHaveBeenCalledWith(false)
        expect(mpStub.gui.chat.activate).toHaveBeenCalledWith(false)
    })

    it('binds Arrow Up to toggle the cursor', async () => {
        await import('@/src/modules/system-controls')

        expect(mpStub.keys.bind).toHaveBeenCalledWith(0x26, true, expect.any(Function))

        const toggle = boundHandler(0x26)
        toggle()
        expect(mpStub.gui.cursor.show).toHaveBeenLastCalledWith(true, true)
        expect(mpStub.gui.cursor.visible).toBe(true)

        toggle()
        expect(mpStub.gui.cursor.show).toHaveBeenLastCalledWith(false, false)
        expect(mpStub.gui.cursor.visible).toBe(false)
    })

    it('can be asked by event to disable built-in chat again', async () => {
        await import('@/src/modules/system-controls')
        const call = mpStub.events.add.mock.calls.find(([name]) => name === 'redage.system.chat.disable')
        expect(call).toBeDefined()

        ;(call![1] as Handler)()

        expect(mpStub.gui.chat.show).toHaveBeenLastCalledWith(false)
        expect(mpStub.gui.chat.activate).toHaveBeenLastCalledWith(false)
    })
})
