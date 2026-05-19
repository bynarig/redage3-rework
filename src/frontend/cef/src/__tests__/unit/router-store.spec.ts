import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRouterStore } from '@/stores/router'

describe('useRouterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts with empty state', () => {
    const store = useRouterStore()
    expect(store.view).toBe('')
    expect(store.popup).toBe('')
    expect(store.playerHud).toBe(false)
    expect(store.opacity).toBe(1)
  })

  describe('setView', () => {
    it('sets the view and clears popup state', () => {
      const store = useRouterStore()
      store.setPopUp('PopupConfirm', { text: 'test' })
      store.setView('PlayerAuthentication')

      expect(store.view).toBe('PlayerAuthentication')
      expect(store.popup).toBe('')
      expect(store.popupData).toBeNull()
    })

    it('passes view data through', () => {
      const store = useRouterStore()
      store.setView('PlayerAtm', { balance: 5000 })
      expect(store.viewData).toEqual({ balance: 5000 })
    })
  })

  describe('setPopUp', () => {
    it('opens a popup without clearing the current view', () => {
      const store = useRouterStore()
      store.setView('PlayerAuthentication')
      store.setPopUp('PopupConfirm', { msg: 'Are you sure?' })

      expect(store.view).toBe('PlayerAuthentication')
      expect(store.popup).toBe('PopupConfirm')
      expect(store.popupData).toEqual({ msg: 'Are you sure?' })
    })

    it('stores the callback function', () => {
      const store = useRouterStore()
      const fn = () => 'ok'
      store.setPopUp('PopupInput', null, fn)
      expect(store.popupFunc).toBe(fn)
    })

    it('closes when called with an empty string', () => {
      const store = useRouterStore()
      store.setPopUp('PopupConfirm')
      store.setPopUp('')
      expect(store.popup).toBe('')
    })
  })

  describe('setHud', () => {
    it('resets everything and enables HUD when called with no argument', () => {
      const store = useRouterStore()
      store.setView('PlayerAtm')
      store.setHud()

      expect(store.view).toBe('')
      expect(store.playerHud).toBe(true)
    })

    it('does nothing if page differs from current view', () => {
      const store = useRouterStore()
      store.setView('PlayerAtm')
      store.setHud('PlayerAuthentication')

      expect(store.view).toBe('PlayerAtm')
      expect(store.playerHud).toBe(false)
    })

    it('enables HUD when explicitly passed PlayerHud', () => {
      const store = useRouterStore()
      store.setView('PlayerCustomization')
      store.setHud('PlayerHud')

      expect(store.view).toBe('')
      expect(store.playerHud).toBe(true)
    })
  })

  describe('addViewData', () => {
    it('shallow-merges objects', () => {
      const store = useRouterStore()
      store.setView('PlayerAtm', { balance: 1000, currency: 'USD' })
      store.addViewData({ balance: 2000 })
      expect(store.viewData).toEqual({ balance: 2000, currency: 'USD' })
    })

    it('replaces non-object data outright', () => {
      const store = useRouterStore()
      store.setView('PlayerAtm', 42)
      store.addViewData({ balance: 100 })
      expect(store.viewData).toEqual({ balance: 100 })
    })
  })

  describe('close', () => {
    it('resets all state', () => {
      const store = useRouterStore()
      store.setView('PlayerAtm')
      store.setPopUp('PopupConfirm', { x: 1 })
      store.close()

      expect(store.view).toBe('')
      expect(store.popup).toBe('')
      expect(store.viewData).toBeNull()
      expect(store.playerHud).toBe(false)
    })
  })
})
