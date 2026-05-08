<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import BezelImage from './assets/bezel/MacBook Pro M5 16-inch Silver.png'
import MacDesktop from './components/desktop/MacDesktop.vue'
import { useLaptopStore } from '@/stores/laptop'
import { provideDevice } from '../shared/composables/useDevice'
import { executeClientToGroup } from '@/api/rage'
import './laptop.scss'

const laptopStore = useLaptopStore()
provideDevice(laptopStore)

const onKeyUp = (event: KeyboardEvent) => {
    if (event.keyCode === 27) {
        executeClientToGroup('close')
    }
}

onMounted(() => {
    laptopStore.initGroup()
    window.addEventListener('keyup', onKeyUp)
})

onUnmounted(() => {
    laptopStore.reset()
    window.removeEventListener('keyup', onKeyUp)
})
</script>

<template>
    <div id="newlaptop" class="laptop-container">
        <div class="laptop-frame">
            <img :src="BezelImage" class="laptop-bezel" alt="MacBook Bezel" />
            <div class="laptop-screen">
                <MacDesktop />
            </div>
        </div>
    </div>
</template>
