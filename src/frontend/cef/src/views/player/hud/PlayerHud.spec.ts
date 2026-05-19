import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import PlayerHud from './PlayerHud.vue'

describe('PlayerHud', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        window.functionList = {}
    })

    afterEach(() => {
        vi.useRealTimers()
        window.functionList = {}
    })

    it('renders server name, online count, voice state, and Kyiv time', async () => {
        vi.setSystemTime(new Date('2026-05-17T12:30:15.000Z'))

        const wrapper = mount(PlayerHud, { props: { visible: true } })
        window.listernEvent?.('redage:hud:update', {
            serverName: 'RedAge UA',
            online: 128,
            voiceActive: true,
            voiceAvailable: true,
        })
        await nextTick()

        expect(wrapper.text()).toContain('RedAge UA')
        expect(wrapper.text()).toContain('128')
        expect(wrapper.text()).toContain('Mic active')
        expect(wrapper.text()).toContain('Kyiv')
    })

    it('does not render while hidden', () => {
        const wrapper = mount(PlayerHud, { props: { visible: false } })

        expect(wrapper.find('.player-hud').exists()).toBe(false)
    })

    it('exposes legacy hudStore methods for server-side scripts', async () => {
        const wrapper = mount(PlayerHud, { props: { visible: true } })

        ;(window as any).hudStore.setServerName('RedAge Test')
        ;(window as any).hudStore.setOnline(42)
        ;(window as any).hudStore.setVoiceActive(false)
        await nextTick()

        expect(wrapper.text()).toContain('RedAge Test')
        expect(wrapper.text()).toContain('42')
        expect(wrapper.text()).toContain('Mic ready')
    })
})
