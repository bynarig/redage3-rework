<script setup lang="ts">
import MapsIcon from '../../../shared/assets/icons/apps/maps/light.png'
import MessagesIcon from '../../../shared/assets/icons/apps/messages/light.png'
import CameraIcon from '../../../shared/assets/icons/apps/camera/light.png'
import SettingsIcon from '../../../shared/assets/icons/apps/settings/light.png'
import LaunchpadIcon from '../../assets/icons/apps/launchpad/light.png'
import GalleryIcon from '../../../shared/assets/icons/apps/photos/light.png'
import NewsIcon from '../../../shared/assets/icons/apps/news/light.png'
import BrowserIcon from '../../../shared/assets/icons/apps/browser/light.png'

import {useLaptopStore} from '@/stores/laptop'
import {executeClientAsyncToGroup} from '@/api/rage'
import {GlassContainer} from "@wxperia/liquid-glass-vue";

const laptopStore = useLaptopStore()

const emit = defineEmits<{
	toggleLaunchpad: []
}>()

const props = defineProps<{
	isLaunchpadActive: boolean
	currentApp: string
}>()

const dockApps = [
	{name: 'Launchpad', isLaunchpad: true},
	{name: 'Сообщения', icon: MessagesIcon, link: 'messages'},
	{name: 'GPS', icon: MapsIcon, link: 'maps'},
	{name: 'Галерея', icon: GalleryIcon, link: 'gallery'},
	{name: 'Камера', icon: CameraIcon, link: 'camera'},
	{name: 'W.News', icon: NewsIcon, link: 'news'},
	{name: 'Браузер', icon: BrowserIcon, link: 'browser'},
	{name: 'Настройки', icon: SettingsIcon, link: 'settings'},
]

const onClickApp = (app: typeof dockApps[0]) => {
	if (app.isLaunchpad) {
		emit('toggleLaunchpad')
		return
	}
	if (!app.link) return

	if (app.link === 'camera') {
		executeClientAsyncToGroup('getGallery').then((result) => {
			if (result && typeof result === 'string') {
				const gallery = JSON.parse(result)
				if (gallery.length >= 25) {
					laptopStore.setPage('gallery')
					;(window as any).notificationAdd?.(4, 9, 'На ноутбуке закончилось место', 3000)
				} else {
					laptopStore.setPage('camera')
				}
			} else {
				laptopStore.setPage('camera')
			}
		})
	} else {
		laptopStore.setPage(app.link as any)
	}
}

const isActive = (app: typeof dockApps[0]) => {
	if (app.isLaunchpad) return props.isLaunchpadActive
	return props.currentApp === app.link
}
</script>

<template>
	<div class="mac-dock-container">
<!--		<GlassContainer-->
<!--			:corner-radius="14"-->
<!--			padding="5px 8px"-->
<!--			:blur-amount="0.8"-->
<!--			:style="{ pointerEvents: 'all', width: 100}"-->
<!--		>-->
			<div class="mac-dock">

				<div
					v-for="app in dockApps"
					:key="app.name"
					class="dock-item"
					:class="{ 'is-active': isActive(app) }"
					:title="app.name"
					@click="onClickApp(app)"
				>
					<img
						v-if="app.isLaunchpad"
						class="dock-icon"
						:src="LaunchpadIcon"
						:alt="app.name"
						draggable="false"
					/>
					<img
						v-else
						class="dock-icon"
						:src="app.icon"
						:alt="app.name"
						draggable="false"
					/>

					<span class="dock-label">{{ app.name }}</span>

					<div class="active-dot" v-if="isActive(app) && !app.isLaunchpad"/>
				</div>
			</div>
<!--		</GlassContainer>-->

	</div>
</template>

<style scoped>
.mac-dock-container {
	position: absolute;
	bottom: 10px;
	width: 100%;
	display: flex;
	justify-content: center;
	z-index: 100;
	pointer-events: none;
}

/* Allow hover labels to overflow above the pill */
:deep(.glass) {
	overflow: visible;
}

/* Re-apply rounded corners directly to the backdrop blur span so blur stays pill-shaped */
:deep(.glass__warp) {
	border-radius: 14px;
}

.mac-dock {
	display: flex;
	align-items: flex-end;
	gap: 4px;
}

.dock-item {
	position: relative;
	width: 36px;
	height: 36px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	border-radius: 10px;
	transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dock-item:hover {
	transform: scale(1.25) translateY(-6px);
}

.dock-item:hover .dock-label {
	opacity: 1;
	transform: translateY(0);
}

.dock-item:active {
	transform: scale(1.1) translateY(-2px);
}

.dock-icon {
	width: 100%;
	height: 100%;
	object-fit: contain;
	border-radius: 9px;
}

.dock-label {
	position: absolute;
	bottom: calc(100% + 8px);
	left: 50%;
	transform: translateX(-50%) translateY(4px);
	background: rgba(30, 30, 30, 0.85);
	backdrop-filter: blur(8px);
	color: white;
	font-size: 10px;
	font-weight: 500;
	padding: 3px 7px;
	border-radius: 5px;
	white-space: nowrap;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.15s ease, transform 0.15s ease;
	font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Helvetica, Arial, sans-serif;
}

.active-dot {
	position: absolute;
	bottom: -5px;
	left: 50%;
	transform: translateX(-50%);
	width: 3px;
	height: 3px;
	background: rgba(255, 255, 255, 0.7);
	border-radius: 50%;
}

.dock-item.is-active .dock-icon {
	filter: brightness(1.08);
}
</style>
