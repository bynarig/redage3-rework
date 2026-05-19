import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useRouterStore } from '@/stores/router'
import PlayerCreation from './PlayerCreation.vue'

const characterMock = vi.hoisted(() => ({
    create: vi.fn(),
    select: vi.fn(),
    character: { value: null },
    loading: { value: false },
    error: { value: null },
}))

vi.mock('@/composables/useCharacter', () => ({
    useCharacter: () => characterMock,
}))

describe('PlayerCreation', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        characterMock.loading.value = false
        characterMock.error.value = null
        characterMock.create.mockResolvedValue(42)
        characterMock.select.mockResolvedValue(true)
    })

    it('creates, selects, and routes a new character into first-time customization', async () => {
        const pinia = createPinia()
        setActivePinia(pinia)
        const wrapper = mount(PlayerCreation, { global: { plugins: [pinia] } })
        const router = useRouterStore()
        const inputs = wrapper.findAll('input[type="text"]')
        expect(inputs).toHaveLength(2)

        await inputs[0]!.setValue('John')
        await inputs[1]!.setValue('Stone')
        await wrapper.find('.player-creation__submit').trigger('click')
        await flushPromises()

        expect(characterMock.create).toHaveBeenCalledWith('John', 'Stone', 'MALE')
        expect(characterMock.select).toHaveBeenCalledWith(42)
        expect(router.view).toBe('PlayerCustomization')
        expect(router.viewData).toEqual({ firstTime: true })
    })

    it('blocks invalid names before calling the server', async () => {
        const wrapper = mount(PlayerCreation, { global: { plugins: [createPinia()] } })

        await wrapper.find('.player-creation__submit').trigger('click')

        expect(characterMock.create).not.toHaveBeenCalled()
        expect(wrapper.find('.player-creation__submit').attributes('disabled')).toBeDefined()
    })
})
