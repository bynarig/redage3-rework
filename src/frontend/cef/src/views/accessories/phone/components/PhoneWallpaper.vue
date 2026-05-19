<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { executeClientAsyncToGroup } from '@/api/rage'

import DefaultWallpaper from '../assets/wallpapers/iClarified-iPhone17-Lavender-Homescreen.jpg'

const background = ref(DefaultWallpaper)

onMounted(() => {
    executeClientAsyncToGroup('settings.wallpaper').then((result) => {
        if (result && typeof result === 'string') {
            background.value = result
        }
    })
})
</script>
<template>
    <div
        class="phone-wallpaper"
        :style="background ? { backgroundImage: `url(${background})` } : { backgroundColor: '#1c1c1e' }"
    ></div>
</template>
<style scoped>
.phone-wallpaper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    z-index: 0;
    pointer-events: none;
}
</style>
