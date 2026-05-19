// UI router store — exact semantic match to src_cef/src/router/index.js.
// Replaces the Svelte writable store with Pinia.
// window.router is wired up in App.vue to expose the same API to the game server.

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRouterStore = defineStore('router', () => {
  const view = ref('')
  const viewData = ref<unknown>(null)
  const popup = ref('')
  const popupData = ref<unknown>(null)
  const popupFunc = ref<((...args: unknown[]) => void) | null>(null)
  const playerGameMenu = ref(false)
  const playerHud = ref(false)
  const opacity = ref(1)

  function _reset() {
    view.value = ''
    viewData.value = null
    popup.value = ''
    popupData.value = null
    popupFunc.value = null
    playerGameMenu.value = false
    playerHud.value = false
    opacity.value = 1
  }

  /** Show a full-screen view, hiding any active popup / HUD state. */
  function setView(page: string, data: unknown = null) {
    _reset()
    view.value = page
    viewData.value = data
  }

  /** Replace the current view's data without changing which view is shown. */
  function setViewData(data: unknown = null) {
    viewData.value = data
  }

  /** Shallow-merge new data into the current view data. */
  function addViewData(data: unknown = null) {
    if (
      viewData.value !== null &&
      typeof viewData.value === 'object' &&
      data !== null &&
      typeof data === 'object'
    ) {
      viewData.value = { ...(viewData.value as object), ...(data as object) }
    } else {
      viewData.value = data
    }
  }

  /** Open a popup overlay on top of the current view. */
  function setPopUp(
    page = '',
    data: unknown = null,
    func: ((...args: unknown[]) => void) | null = null,
  ) {
    popup.value = page
    popupData.value = data
    popupFunc.value = func
  }

  /** Replace the current popup's data without re-opening it. */
  function setPopUpData(data: unknown = null) {
    popupData.value = data
  }

  /**
   * Reset all UI state and show one of the static overlay components
   * (PlayerGameMenu or PlayerHud). Passing nothing/undefined closes all UI.
   */
  function updateStatic(page?: string) {
    _reset()
    if (page === 'PlayerGameMenu') playerGameMenu.value = true
    else if (page === 'PlayerHud') playerHud.value = true
  }

  /** Switch to HUD-only mode: clears all views/popups and shows the HUD. */
  function setHud(page?: string) {
    if (!page || page === 'PlayerHud' || page === view.value) {
      _reset()
      playerHud.value = true
    }
  }

  /** Close all UI — view, popup, HUD, and game menu. */
  function close() {
    _reset()
  }

  /** Set global UI opacity (0 = hidden, 1 = fully visible). */
  function setOpacity(value: number) {
    opacity.value = value
  }

  return {
    view,
    viewData,
    popup,
    popupData,
    popupFunc,
    playerGameMenu,
    playerHud,
    opacity,
    setView,
    setViewData,
    addViewData,
    setPopUp,
    setPopUpData,
    updateStatic,
    setHud,
    close,
    setOpacity,
  }
})
