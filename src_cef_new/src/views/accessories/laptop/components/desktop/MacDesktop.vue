<script setup lang="ts">
import { ref, computed } from 'vue'
import MacMenuBar from './MacMenuBar.vue'
import MacDock from './MacDock.vue'
import MacLaunchpad from '../launchpad/MacLaunchpad.vue'
import MacWindow from '../window/MacWindow.vue'

import DefaultWallpaper from '../../assets/wallpapers/465563.jpg'

import MessagesApp from '../messages/MessagesApp.vue'
import GpsApp from '../gps/GpsApp.vue'
import GalleryApp from '../gallery/GalleryApp.vue'
import SettingsApp from '../settings/SettingsApp.vue'
import WeatherApp from '../weather/WeatherApp.vue'
import RadioApp from '../radio/RadioApp.vue'
import TaxiApp from '../taxi/TaxiApp.vue'
import CarsApp from '../cars/CarsApp.vue'
import MechApp from '../mech/MechApp.vue'
import NewsApp from '../news/NewsApp.vue'
import PropertyApp from '../property/PropertyApp.vue'
import ForbesApp from '../forbes/ForbesApp.vue'
import AuctionApp from '../auction/AuctionApp.vue'
import TinderApp from '../tinder/TinderApp.vue'
import TruckerApp from '../trucker/TruckerApp.vue'
import CameraApp from '../camera/CameraApp.vue'
import SupportApp from '../support/SupportApp.vue'
import BrowserApp from '@/views/accessories/shared/apps/BrowserApp.vue'

import { useLaptopStore } from '@/stores/laptop'
import type { Component } from 'vue'

const laptopStore = useLaptopStore()

const APP_MAP: Record<string, Component> = {
    messages: MessagesApp,
    maps: GpsApp,
    gallery: GalleryApp,
    camera: CameraApp,
    settings: SettingsApp,
    weather: WeatherApp,
    radio: RadioApp,
    taxi: TaxiApp,
    cars: CarsApp,
    mech: MechApp,
    news: NewsApp,
    property: PropertyApp,
    forbes: ForbesApp,
    auction: AuctionApp,
    tinder: TinderApp,
    trucker: TruckerApp,
    support: SupportApp,
    browser: BrowserApp,
}

const APP_NAMES: Record<string, string> = {
    maps: 'GPS',
    gallery: 'Галерея',
    property: 'Имущество',
    news: 'W.News',
    trucker: 'Развозчик',
    taxi: 'Такси',
    rental: 'Аренда',
    mech: 'Механик',
    forbes: 'Forbes',
    auction: 'Аукцион',
    messages: 'Сообщения',
    camera: 'Камера',
    settings: 'Настройки',
    weather: 'Weather',
    radio: 'Radio',
    cars: 'Cars',
    tinder: 'Tinder',
    support: 'iFruit Support',
    browser: 'Браузер',
}

const currentApp = computed(() => {
    if (laptopStore.currentPage === 'mainmenu') return null
    return APP_MAP[laptopStore.currentPage] ?? null
})

const currentAppName = computed(() => {
    if (isLaunchpadOpen.value) return 'Launchpad'
    if (laptopStore.currentPage === 'mainmenu') return 'Finder'
    return APP_NAMES[laptopStore.currentPage] || 'App'
})

const isLaunchpadOpen = ref(false)

const toggleLaunchpad = () => {
    isLaunchpadOpen.value = !isLaunchpadOpen.value
}

const onOpenApp = (link: string | number) => {
    isLaunchpadOpen.value = false
    if (typeof link === 'number') {
        laptopStore.selectNumber = link
        laptopStore.setPage('messages')
    } else {
        laptopStore.setPage(link as any)
    }
}
</script>

<template>
    <div
        class="mac-desktop"
        :style="{ backgroundImage: `url(${DefaultWallpaper})` }"
    >
        <MacMenuBar :app-name="currentAppName" />

        <div class="mac-content">
            <Transition name="window-fade">
                <MacWindow v-if="currentApp" :title="currentAppName">
                    <component :is="currentApp" />
                </MacWindow>
            </Transition>
        </div>

        <!-- Dock spacer keeps flex flow from extending behind the absolute dock -->
        <div class="dock-spacer" />

        <Transition name="launchpad-fade">
            <MacLaunchpad v-if="isLaunchpadOpen" @close="isLaunchpadOpen = false" @open-app="onOpenApp" />
        </Transition>

        <MacDock @toggle-launchpad="toggleLaunchpad" :is-launchpad-active="isLaunchpadOpen" :current-app="laptopStore.currentPage" />
    </div>
</template>

<style scoped>
.mac-desktop {
    width: 100%;
    height: 100%;
    position: relative;
    background-size: cover;
    background-position: center;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Helvetica, Arial, sans-serif;
}

.mac-content {
    flex: 1;
    position: relative;
    z-index: 10;
    min-height: 0;
}

.dock-spacer {
    height: 58px;
    flex-shrink: 0;
}

.window-fade-enter-active,
.window-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.window-fade-enter-from,
.window-fade-leave-to {
    opacity: 0;
    transform: scale(0.96);
}

.launchpad-fade-enter-active {
    transition: opacity 0.25s ease;
}
.launchpad-fade-leave-active {
    transition: opacity 0.2s ease;
}
.launchpad-fade-enter-from,
.launchpad-fade-leave-to {
    opacity: 0;
}
</style>
