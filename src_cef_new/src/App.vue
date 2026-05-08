<script setup lang="ts">
import "./components/ui/index.ts"
import {computed, onMounted, onBeforeUnmount, defineAsyncComponent} from 'vue'
import {defineComponent, h} from 'vue'
import type {Component} from 'vue'
import {useRouterStore} from '@/stores/router'
import {useNotificationStore} from '@/stores/notification'
import FadecontainerComponent from '@/components/fadecontainer/fadecontainer.component.vue'
import ViewcontainerComponent from '@/components/viewcontainer/viewcontainer.component.vue'
import PopupsContainerComponent from '@/components/popuscontainer/popups.container.component.vue'
// ── Popups ─────────────────────────────────────────────────────────────────────
import PopupConfirmPopup from '@/popups/confirm/confirm.popup.vue'
import HospitalConfirmPopup from '@/popups/confirm/hospital.confirm.popup.vue'
import PopupInputPopup from '@/popups/input/input.popup.vue'
import PopupDeathPopup from '@/popups/death/death.popup.vue'
import PopupDonatePopup from '@/popups/donate/donate.popup.vue'
import CirclePopupMenu from '@/popups/circle/circle.popup.vue'
import PopupSelectPopup from '@/popups/select/select.popup.vue'
import PopupMainPopup from '@/popups/main/main.popup.vue'
import PopupUpgradePopup from '@/popups/upgrade/upgrade.popup.vue'
import PopupRoulettePopup from '@/popups/roulette/roulette.popup.vue'
import PopupCameraPopup from '@/popups/camera/camera.popup.vue'
import PopupWarPopup from '@/popups/war/war.popup.vue'

// ── Stub factory ───────────────────────────────────────────────────────────────
// Placeholder for views not yet migrated. Replace entry in VIEW_LOADERS once the
// real component exists — the stub disappears automatically.
function stub(name: string): Component {
	return defineComponent({
		name,
		props: {viewData: null, visible: Boolean},
		render: () =>
			import.meta.env.DEV
				? h('div', {'data-stub': name, style: 'display:none'})
				: h('div'),
	})
}

// ── View registry ──────────────────────────────────────────────────────────────
// Only migrated views live here — add a loader entry when a stub becomes real.
// Unlisted view names fall through to stub() at runtime.
const VIEW_LOADERS: Record<string, () => Promise<{ default: Component }>> = {
	PlayerPhone: () => import('@/views/accessories/phone/Phone.vue'),
	PlayerLaptop: () => import('@/views/accessories/laptop/Laptop.vue'),
	PlayerTablet: () => import('@/views/accessories/tablet/Tablet.vue'),
	PlayerWatch: () => import('@/views/accessories/watch/Watch.vue'),
}

// Pre-build async-component wrappers once so computed doesn't recreate them.
const VIEWS: Record<string, Component> = Object.fromEntries(
	Object.entries(VIEW_LOADERS).map(([name, loader]) => [name, defineAsyncComponent(loader)])
)

// Static overlays — always mounted, shown/hidden via their own :visible prop.
const OVERLAY_GAME_MENU = stub('PlayerGameMenu')
const OVERLAY_HUD = stub('PlayerHud')

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

// ── Stores ─────────────────────────────────────────────────────────────────────
const routerStore = useRouterStore()
const notificationStore = useNotificationStore()

const currentView = computed(() => VIEWS[routerStore.view] ?? stub(routerStore.view))
const currentPopup = computed(() => POPUPS[routerStore.popup] ?? null)

// ── window.router — game-server-facing API ─────────────────────────────────────
// Matches the interface exposed in src_cef/src/router/index.js exactly.
;(window as any).router = {
	setView: (page: string, data?: unknown) => routerStore.setView(page, data),
	setViewData: (data?: unknown) => routerStore.setViewData(data),
	addViewData: (data?: unknown) => routerStore.addViewData(data),
	setPopUp: (page?: string, data?: unknown, func?: (...args: unknown[]) => void) =>
		routerStore.setPopUp(page ?? '', data ?? null, func ?? null),
	setPopUpData: (data?: unknown) => routerStore.setPopUpData(data),
	updateStatic: (page?: string) => routerStore.updateStatic(page),
	setHud: (page?: string) => routerStore.setHud(page),
	close: () => routerStore.close(),
	opacity: (value: number) => routerStore.setOpacity(value),
}

// ── window.notificationAdd — C# server-facing API ──────────────────────────────
;(window as any).notificationAdd = notificationStore.add.bind(notificationStore)

// ── Startup ────────────────────────────────────────────────────────────────────
function triggerClient(event: string, ...args: unknown[]) {
	;(window as any).mp?.trigger(event, ...args)
}

onMounted(async () => {
	triggerClient('client:OnBrowserInit')

	const isMultiplayer = !!(window as any).mp?.events
	if (!isMultiplayer) {
		;(window as any).FadeScreen?.(false, 0)
		// Restore last view/popup across HMR — import lazily so it tree-shakes from prod.
		const {devReadView, devReadPopup} = await import('./dev/mp-mock')
		const savedView = devReadView()
		const savedPopup = devReadPopup()
		if (savedView) routerStore.setView(savedView)
		if (savedPopup) routerStore.setPopUp(savedPopup)
	} else {
		routerStore.setView('PlayerAuthentication')
	}
})

// ── Keyboard handling ──────────────────────────────────────────────────────────
// TODO: replace window.keys / window.storeAnimBind / window.hudStore globals
//       with Pinia stores once keys, hud, and chars stores are migrated.

let isKeyBind = -1
let isKeyDown = false
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

	const {keyCode} = event
	const ANIM_KEY = (window as any).keys?.[8] as number | undefined
	const PET_KEY = (window as any).keys?.[55] as number | undefined

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
			;(window as any).hudStore?.isAnimal(true)
			triggerClient('client.pet.isUse', true)
			;(window as any).SetBindToKey(PET_KEY)
		}
	}
}

function handleKeyup(event: KeyboardEvent) {
	if (!isKeyDown || !routerStore.playerHud) return

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
		<FadecontainerComponent/>

		<ViewcontainerComponent :visible="!!routerStore.popup">
			<component
				:is="currentView"
				v-if="routerStore.view"
				:view-data="routerStore.viewData"
			/>

			<!-- Static overlays: always mounted, visibility driven by their own prop -->
			<component :is="OVERLAY_GAME_MENU" :visible="routerStore.playerGameMenu"/>
			<component :is="OVERLAY_HUD" :visible="routerStore.playerHud"/>
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
