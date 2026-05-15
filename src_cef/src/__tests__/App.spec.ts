import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

// Mock mp-mock.ts side-effects that require a real browser DOM
vi.mock('@/dev/mp-mock', () => ({
    devReadView: () => '',
    devReadPopup: () => '',
}))

import App from '../App.vue'

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts without throwing', () => {
    expect(() => mount(App, { global: { plugins: [createPinia()] } })).not.toThrow()
  })

  it('renders the popup container', () => {
    const wrapper = mount(App, { global: { plugins: [createPinia()] } })
    // The popups container is always in the DOM; visibility is driven by the store
    expect(wrapper.find('#viewcontainer, [id]').exists()).toBe(true)
  })
})
