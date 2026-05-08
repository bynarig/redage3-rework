<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useWatchStore } from '@/stores/watch'
import { executeClientToGroup } from '@/api/rage'
import { provideDevice } from '../shared/composables/useDevice'

import WatchClockFace from './components/clockface/WatchClockFace.vue'
import WatchHomescreen from './components/homescreen/WatchHomescreen.vue'

import BezelImage from './assets/bezel/AW Ultra 3 - Natural + Milanese Loop.png'

import './watch.scss'

import type { Component } from 'vue'

const watchStore = useWatchStore()

provideDevice(watchStore)

const PAGE_MAP: Record<string, Component> = {
    mainmenu: WatchClockFace,
    homescreen: WatchHomescreen,
}

const currentView = computed(() => PAGE_MAP[watchStore.currentPage] ?? WatchClockFace)

const onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
        executeClientToGroup('close')
    }
}

onMounted(() => {
    watchStore.initGroup()
    window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
    watchStore.reset()
    window.removeEventListener('keyup', onKeyUp)
})
</script>

<template>
    <div id="newwatch" class="watch-container">
        <div class="watch-frame">
            <img :src="BezelImage" class="watch-bezel" alt="Watch Bezel" />
            <div class="watch-screen">
                <Transition name="aw-switch" mode="out-in">
                    <component :is="currentView" :key="watchStore.currentPage" />
                </Transition>
            </div>
        </div>
    </div>
</template>
