import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useRouterStore } from '@/stores/router'
import PlayerCustomization from './PlayerCustomization.vue'

const defaultAppearance = {
    hairId: 0,
    beardId: 0,
    eyebrowsId: 0,
    bodyId: 0,
    eyesId: 0,
    lipsId: 0,
    paletteId: 0,
    makeupId: 0,
}

const characterMock = vi.hoisted(() => ({
    character: {
        value: {
            id: 1,
            name: 'John Stone',
            gender: 'MALE' as 'MALE' | 'FEMALE',
            appearance: null as typeof defaultAppearance | null,
        },
    },
}))

const customizationMock = vi.hoisted(() => {
    const state = {
        appearance: {
            value: {
                hairId: 0,
                beardId: 0,
                eyebrowsId: 0,
                bodyId: 0,
                eyesId: 0,
                lipsId: 0,
                paletteId: 0,
                makeupId: 0,
            },
        },
        loading: { value: false },
        error: { value: null as string | null },
        patch: vi.fn((partial: Partial<typeof defaultAppearance>) => {
            state.appearance.value = { ...state.appearance.value, ...partial }
        }),
        set: vi.fn((next: typeof defaultAppearance) => {
            state.appearance.value = { ...next }
        }),
        reset: vi.fn(),
        preview: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        save: vi.fn(),
    }
    return state
})

vi.mock('@/composables/useCharacter', () => ({
    useCharacter: () => characterMock,
}))

vi.mock('@/composables/useCustomization', () => ({
    useCustomization: () => customizationMock,
}))

describe('PlayerCustomization', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        characterMock.character.value.gender = 'MALE'
        characterMock.character.value.appearance = null
        customizationMock.appearance.value = { ...defaultAppearance }
        customizationMock.loading.value = false
        customizationMock.error.value = null
        customizationMock.save.mockResolvedValue(true)
    })

    it('starts the preview session on mount', () => {
        mount(PlayerCustomization, { global: { plugins: [createPinia()] } })

        expect(customizationMock.start).toHaveBeenCalledTimes(1)
        expect(customizationMock.preview).toHaveBeenCalledTimes(1)
    })

    it('uses gender-limited appearance tabs from the legacy customization flow', () => {
        const wrapper = mount(PlayerCustomization, { global: { plugins: [createPinia()] } })
        const labels = wrapper.findAll('.player-customization__tabs button').map((button) => button.text())

        expect(labels).toContain('Beard')
        expect(labels).toContain('Chest')
        expect(labels).not.toContain('Lips')
    })

    it('shows female-only lips while hiding male-only beard and chest categories', () => {
        characterMock.character.value.gender = 'FEMALE'
        const wrapper = mount(PlayerCustomization, { global: { plugins: [createPinia()] } })
        const labels = wrapper.findAll('.player-customization__tabs button').map((button) => button.text())

        expect(labels).toContain('Lips')
        expect(labels).not.toContain('Beard')
        expect(labels).not.toContain('Chest')
    })

    it('previews every local pick immediately', async () => {
        const wrapper = mount(PlayerCustomization, { global: { plugins: [createPinia()] } })
        await wrapper.find('.player-customization__list li').trigger('click')

        expect(customizationMock.patch).toHaveBeenCalledWith({ hairId: expect.any(Number) })
        expect(customizationMock.preview).toHaveBeenCalledTimes(2)
    })

    it('saves, closes the session, and routes to HUD', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const wrapper = mount(PlayerCustomization, { global: { plugins: [pinia] } })
        const router = useRouterStore()

        await wrapper.find('.player-customization__done').trigger('click')
        await flushPromises()

        expect(customizationMock.save).toHaveBeenCalledTimes(1)
        expect(customizationMock.stop).toHaveBeenCalledTimes(1)
        expect(router.playerHud).toBe(true)
    })
})
