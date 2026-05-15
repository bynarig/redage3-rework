<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, Transition } from 'vue'
import { usePhoneStore } from '@/stores/phone'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { provideDevice } from '../shared/composables/useDevice'

import PhoneNotification from './components/PhoneNotification.vue'
import GalleryPopup from './components/gallery/GalleryPopup.vue'
import MainMenu from './components/mainmenu/MainMenu.vue'
import CallApp from './components/calls/CallApp.vue'
import CallView from './components/calls/CallView.vue'
import MessagesApp from './components/messages/MessagesApp.vue'
import GpsApp from './components/gps/GpsApp.vue'
import GalleryApp from './components/gallery/GalleryApp.vue'
import CameraApp from './components/camera/CameraApp.vue'
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

import BezelImage from './assets/bezel/iPhone 17 Pro Max - Silver - Portrait.png'

import './phone.scss'

import type { Component } from 'vue'

const props = defineProps<{
    viewData?: { notification?: { Name: string; Text: string; Avatar?: string } } | null
}>()

const phoneStore = usePhoneStore()

provideDevice(phoneStore)

const phoneNotification = computed(() => props.viewData?.notification ?? null)

const PAGE_MAP: Record<string, Component> = {
    mainmenu: MainMenu,
    call: CallApp,
    callView: CallView,
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
}

const currentView = computed(() => PAGE_MAP[phoneStore.currentPage] ?? null)

const checkCall = () => {
    executeClientAsyncToGroup('isCall').then((result) => {
        if (result) {
            phoneStore.setPage('callView')
        } else if (phoneStore.currentPage === 'callView') {
            phoneStore.setPage('mainmenu')
        }
    })
}

const onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
        executeClientToGroup('close')
    }
}

onMounted(() => {
    phoneStore.initGroup()
    checkCall()
    addListernEvent('isPhoneCall', checkCall)
    window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
    phoneStore.reset()

    window.removeEventListener('keyup', onKeyUp)
})
</script>

<template>
    <div id="newphone" class="phone-container">
        <div class="phone-frame">
            <img :src="BezelImage" class="phone-bezel" alt="iPhone Bezel" />
            <div class="phone-screen">
                <PhoneNotification v-if="phoneNotification" :notification="phoneNotification" />
                <GalleryPopup v-if="phoneStore.selectedImage" />
                <component :is="currentView" v-if="currentView" />
                <div class="ios-home-indicator" @click="phoneStore.setPage('mainmenu')"></div>
            </div>
        </div>
    </div>
</template>


<style>
</style>
