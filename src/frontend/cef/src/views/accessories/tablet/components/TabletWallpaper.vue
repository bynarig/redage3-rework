<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { executeClientAsyncToGroup } from '@/api/rage'
import DefaultWallpaper from '../assets/wallpapers/wallpaper-official.jpg'

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
        class="tablet-wallpaper"
        :style="background ? { backgroundImage: `url(${background})` } : { backgroundColor: '#1c1c1e' }"
    ></div>
</template>
<style scoped>
.tablet-wallpaper {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* Use 'filter' instead of 'backdrop-filter' */
	filter: blur(3px);
	/* Scale slightly to prevent white edges caused by the blur */
	transform: scale(1.01);
	background-size: cover;
	background-position: center;
	z-index: 0;
	pointer-events: none;
	overflow: hidden;
}
</style>
