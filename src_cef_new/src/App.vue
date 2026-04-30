<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { defineComponent, h } from 'vue'
import type { Component } from 'vue'
import { useRouterStore } from '@/stores/router'
import FadecontainerComponent from '@/components/fadecontainer/fadecontainer.component.vue'
import ViewcontainerComponent from '@/components/viewcontainer/viewcontainer.component.vue'
import PopupsContainerComponent from '@/components/popuscontainer/popups.container.component.vue'

// ── Popups ─────────────────────────────────────────────────────────────────────
import PopupConfirmPopup         from '@/popups/confirm/confirm.popup.vue'
import HospitalConfirmPopup from '@/popups/confirm/hospital.confirm.popup.vue'
import PopupInputPopup           from '@/popups/input/input.popup.vue'
import PopupDeathPopup           from '@/popups/death/death.popup.vue'
import PopupDonatePopup          from '@/popups/donate/donate.popup.vue'
import CirclePopupMenu           from '@/popups/circle/circle.popup.vue'
import PopupSelectPopup          from '@/popups/select/select.popup.vue'
import PopupMainPopup            from '@/popups/main/main.popup.vue'
import PopupUpgradePopup         from '@/popups/upgrade/upgrade.popup.vue'
import PopupRoulettePopup        from '@/popups/roulette/roulette.popup.vue'
import PopupCameraPopup          from '@/popups/camera/camera.popup.vue'
import PopupWarPopup             from '@/popups/war/war.popup.vue'

// ── Stub factory ───────────────────────────────────────────────────────────────
// Used for views not yet migrated to Vue. Replace with:
//   defineAsyncComponent(() => import('@/views/.../index.vue'))
// once the view exists.
function stub(name: string): Component {
  return defineComponent({
    name,
    props: { viewData: null, visible: Boolean },
    render: () =>
      import.meta.env.DEV
        ? h('div', { 'data-stub': name, style: 'display:none' })
        : h('div'),
  })
}

// ── View registry ──────────────────────────────────────────────────────────────
// All views registered in the legacy App.svelte, kept in the same category order.
// Each stub is a no-op placeholder — swap it for a real async import when migrating.
const VIEWS: Record<string, Component> = {
  // Player
  PlayerAuthentication:  stub('PlayerAuthentication'),
  PlayerBattlePass:      stub('PlayerBattlePass'),
  PlayerCustomization:   stub('PlayerCustomization'),
  PlayerAtm:             stub('PlayerAtm'),
  PlayerBinder:          stub('PlayerBinder'),
  PlayerDocuments:       stub('PlayerDocuments'),
  PlayerClothesEditor:   stub('PlayerClothesEditor'),
  PlayerCarMarket:       stub('PlayerCarMarket'),
  PlayerHelp:            stub('PlayerHelp'),
  PlayerLicense:         stub('PlayerLicense'),
  PlayerPassport:        stub('PlayerPassport'),
  PlayerDropinfo:        stub('PlayerDropinfo'),
  PlayerLift:            stub('PlayerLift'),
  PlayerGasStation:      stub('PlayerGasStation'),
  PlayerBreakingLock:    stub('PlayerBreakingLock'),
  PlayerTransfer:        stub('PlayerTransfer'),
  PlayerJobSelector:     stub('PlayerJobSelector'),
  PlayerReports:         stub('PlayerReports'),
  PlayerAnimations:      stub('PlayerAnimations'),
  PlayerOresSale:        stub('PlayerOresSale'),
  PlayerMetro:           stub('PlayerMetro'),
  PlayerWedding:         stub('PlayerWedding'),
  PlayerTickets:         stub('PlayerTickets'),
  PlayerRestart:         stub('PlayerRestart'),
  PlayerRentCar:         stub('PlayerRentCar'),

  // Static overlays (always mounted, visibility controlled by prop)
  PlayerGameMenu:        stub('PlayerGameMenu'),
  PlayerHud:             stub('PlayerHud'),

  // Business
  BusinessAutoShop:      stub('BusinessAutoShop'),
  BusinessWeaponShop:    stub('BusinessWeaponShop'),
  BusinessPetShop:       stub('BusinessPetShop'),
  BusinessMenu:          stub('BusinessMenu'),
  BusinessNewPetShop:    stub('BusinessNewPetShop'),
  BusinessClothes:       stub('BusinessClothes'),

  // Fractions
  FractionsBSearch:        stub('FractionsBSearch'),
  FractionsMats:           stub('FractionsMats'),
  FractionsCraft:          stub('FractionsCraft'),
  FractionsCreate:         stub('FractionsCreate'),
  FractionsStock:          stub('FractionsStock'),
  FractionsPolicecomputer: stub('FractionsPolicecomputer'),
  FractionsTicket:         stub('FractionsTicket'),
  FractionsBortovoi:       stub('FractionsBortovoi'),
  FractionsWeazelNews:     stub('FractionsWeazelNews'),
  FractionsWar:            stub('FractionsWar'),

  // Casino
  CasinoBlackjack:   stub('CasinoBlackjack'),
  CasinoHorse:       stub('CasinoHorse'),
  CasinoJacpot:      stub('CasinoJacpot'),
  CasinoRoullete:    stub('CasinoRoullete'),

  // Vehicle
  VehicleAir:      stub('VehicleAir'),
  VehicleLsCustom: stub('VehicleLsCustom'),

  // Games
  GamesOtherMain:  stub('GamesOtherMain'),
  GamesOtherMafia: stub('GamesOtherMafia'),
  GamesOtherLobby: stub('GamesOtherLobby'),

  // Donate
  DonateMain:   stub('DonateMain'),
  DonateSapper: stub('DonateSapper'),

  // Quests
  QuestsDialog: stub('QuestsDialog'),

  // Events
  EventsValentine: stub('EventsValentine'),

  // House
  HouseMenu:      stub('HouseMenu'),
  HouseRielt:     stub('HouseRielt'),
  HouseBuy:       stub('HouseBuy'),
  HouseFurniture: stub('HouseFurniture'),
}

// ── Popup registry ─────────────────────────────────────────────────────────────
const POPUPS: Record<string, Component> = {
  PopupConfirm: PopupConfirmPopup,
  HospitalPopupConfirm: HospitalConfirmPopup,
  PopupInput: PopupInputPopup,
  PopupDeath: PopupDeathPopup,
  PopupDonate: PopupDonatePopup,
  CircleMenu: CirclePopupMenu,
  PopupSelect: PopupSelectPopup,
  PopupMain: PopupMainPopup,
  PopupUpgrade: PopupUpgradePopup,
  PopupRoulette: PopupRoulettePopup,
  PopupCamera: PopupCameraPopup,
  PopupWar: PopupWarPopup,
}

// ── Router store ───────────────────────────────────────────────────────────────
const routerStore = useRouterStore()

const currentView  = computed(() => VIEWS[routerStore.view]  ?? null)
const currentPopup = computed(() => POPUPS[routerStore.popup] ?? null)

// ── window.router — game-server-facing API ─────────────────────────────────────
// Matches the interface exposed in src_cef/src/router/index.js exactly.
;(window as any).router = {
  setView:      (page: string, data?: unknown) => routerStore.setView(page, data),
  setViewData:  (data?: unknown)               => routerStore.setViewData(data),
  addViewData:  (data?: unknown)               => routerStore.addViewData(data),
  setPopUp:     (page?: string, data?: unknown, func?: (...args: unknown[]) => void) =>
                  routerStore.setPopUp(page ?? '', data ?? null, func ?? null),
  setPopUpData: (data?: unknown)               => routerStore.setPopUpData(data),
  updateStatic: (page?: string)                => routerStore.updateStatic(page),
  setHud:       (page?: string)                => routerStore.setHud(page),
  close:        ()                             => routerStore.close(),
  opacity:      (value: number)                => routerStore.setOpacity(value),
}

// ── Startup ────────────────────────────────────────────────────────────────────
function triggerClient(event: string, ...args: unknown[]) {
  ;(window as any).mp?.trigger(event, ...args)
}

onMounted(() => {
  triggerClient('client:OnBrowserInit')

  const isMultiplayer = !!(window as any).mp?.events
  if (!isMultiplayer) {
    // Dev mode: no real RAGE:MP context — mp-mock provides window.mp.trigger only.
    ;(window as any).FadeScreen?.(false, 0)
  } else {
    routerStore.setView('PlayerAuthentication')
  }
})

// ── Keyboard handling ──────────────────────────────────────────────────────────
// Mirrors the keydown / keyup logic from App.svelte.
// Guards that reference unmigrated stores are noted with TODO:
//   keys store    → $keys[N]         (src/modules/constants/keys)
//   hud store     → $inVehicle, $isInputToggled
//   animation store → $storeAnimBind
//   chars store   → $charIsPet

let isKeyBind     = -1
let isKeyDown     = false
let isKeyBindUsed = false

const KEY_TO_SLOT: Record<number, number> = {
  48: 9, 49: 0, 50: 1, 51: 2, 52: 3,
  53: 4, 54: 5, 55: 6, 56: 7, 57: 8,
}

;(window as any).SetBindToKey = (key: number) => {
  isKeyDown = key !== -1
  isKeyBind = key
  triggerClient('setBindToKey', key)
}

function handleKeydown(event: KeyboardEvent) {
  if (!routerStore.playerHud) return
  // TODO: add `if ($inVehicle || $isInputToggled) return` once hud store is migrated

  const { keyCode } = event
  // TODO: replace magic numbers with keys store values ($keys[8], $keys[55])
  const ANIM_KEY = (window as any).keys?.[8]  as number | undefined
  const PET_KEY  = (window as any).keys?.[55] as number | undefined

  if (isKeyBind !== -1) {
    if (ANIM_KEY !== undefined && isKeyBind === ANIM_KEY) {
      const animBind = (window as any).storeAnimBind as string[] | undefined
      if (animBind) {
        const slot = KEY_TO_SLOT[keyCode]
        if (slot !== undefined && animBind[slot]?.split('_')) {
          triggerClient('client.animation.play', animBind[slot])
          isKeyBindUsed = true
          ;(window as any).SetBindToKey(-1)
          return
        }
      }
    } else if (PET_KEY !== undefined && isKeyBind === PET_KEY && keyCode === PET_KEY) {
      ;(window as any).hudStore?.isAnimal(false)
      triggerClient('client.pet.isUse', false)
      ;(window as any).SetBindToKey(-1)
    }
  } else {
    if (isKeyDown) return

    if (ANIM_KEY !== undefined && keyCode === ANIM_KEY) {
      isKeyBindUsed = false
      ;(window as any).SetBindToKey(ANIM_KEY)
    } else if (keyCode === 32) {
      triggerClient('client.animation.stop')
    } else if (PET_KEY !== undefined && keyCode === PET_KEY) {
      // TODO: gate on $charIsPet once chars store is migrated
      ;(window as any).hudStore?.isAnimal(true)
      triggerClient('client.pet.isUse', true)
      ;(window as any).SetBindToKey(PET_KEY)
    }
  }
}

function handleKeyup(event: KeyboardEvent) {
  if (!isKeyDown || !routerStore.playerHud) return
  // TODO: add inVehicle / isInputToggled guards once hud store is migrated

  const ANIM_KEY = (window as any).keys?.[8] as number | undefined
  if (ANIM_KEY !== undefined && event.keyCode === ANIM_KEY) {
    ;(window as any).SetBindToKey(-1)
    if (!isKeyBindUsed) triggerClient('client.animation.open')
  }
}

window.addEventListener('keydown', handleKeydown)
window.addEventListener('keyup', handleKeyup)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
})
</script>

<template>
  <FadecontainerComponent />


  <ViewcontainerComponent
    :visible="!!routerStore.popup">
    <component
      :is="currentView"
      v-if="currentView"
      :view-data="routerStore.viewData"
    />

    <!-- Static overlays: always mounted, visibility driven by their own prop -->
    <component :is="VIEWS.PlayerGameMenu" :visible="routerStore.playerGameMenu" />
    <component :is="VIEWS.PlayerHud"      :visible="routerStore.playerHud" />
  </ViewcontainerComponent>

  <PopupsContainerComponent :visible="!!routerStore.popup" :opacity="routerStore.opacity">
    <component
      :is="currentPopup"
      v-if="currentPopup"
      :popup-data="routerStore.popupData"
      :popup-func="routerStore.popupFunc"
    />
  </PopupsContainerComponent>
</template>
