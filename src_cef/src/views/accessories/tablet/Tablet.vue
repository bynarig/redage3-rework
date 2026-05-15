<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useTabletStore } from '@/stores/tablet'
import { executeClientToGroup } from '@/api/rage'
import { provideDevice } from '../shared/composables/useDevice'

import GalleryPopup from '../phone/components/gallery/GalleryPopup.vue'
import TabletMainMenu from './components/mainmenu/TabletMainMenu.vue'
import MessagesApp from './components/messages/MessagesApp.vue'
import GpsApp from './components/gps/GpsApp.vue'
import GalleryApp from './components/gallery/GalleryApp.vue'
import SettingsApp from './components/settings/SettingsApp.vue'
import WeatherApp from './components/weather/WeatherApp.vue'
import RadioApp from './components/radio/RadioApp.vue'
import TaxiApp from './components/taxi/TaxiApp.vue'
import CarsApp from './components/cars/CarsApp.vue'
import MechApp from './components/mech/MechApp.vue'
import NewsApp from './components/news/NewsApp.vue'
import PropertyApp from './components/property/PropertyApp.vue'
import ForbesApp from './components/forbes/ForbesApp.vue'
import AuctionApp from './components/auction/AuctionApp.vue'
import TinderApp from './components/tinder/TinderApp.vue'
import TruckerApp from './components/trucker/TruckerApp.vue'

import BezelImage from './assets/bezel/iPad Pro (M5) 13" - Space Black - Landscape.png'

import './tablet.scss'

import type { Component } from 'vue'

const tabletStore = useTabletStore()

provideDevice(tabletStore)

const PAGE_MAP: Record<string, Component> = {
    mainmenu: TabletMainMenu,
    messages: MessagesApp,
    maps: GpsApp,
    gallery: GalleryApp,
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
}

const currentView = computed(() => PAGE_MAP[tabletStore.currentPage] ?? null)

const onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
        executeClientToGroup('close')
    }
}

onMounted(() => {
    tabletStore.initGroup()
    window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
    tabletStore.reset()
    window.removeEventListener('keyup', onKeyUp)
})
</script>

<template>
    <div id="newtablet" class="tablet-container">
        <div class="tablet-frame">
            <img :src="BezelImage" class="tablet-bezel" alt="iPad Bezel" />
            <div class="tablet-screen">
                <GalleryPopup v-if="tabletStore.selectedImage" />
                <component :is="currentView" v-if="currentView" />
                <div class="tablet-home-indicator" @click="tabletStore.setPage('mainmenu')"></div>
            </div>
        </div>
    </div>
</template>
