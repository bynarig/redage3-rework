<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    blur?: number
    opacity?: number
    color?: string
}>(), {
    blur: 14,
    opacity: 0.1,
    color: '',
})

const filterStyle = computed(() => ({
    backgroundColor: props.color || `rgba(255,255,255,${props.opacity})`,
    WebkitBackdropFilter: `blur(${props.blur}px) saturate(180%)`,
    backdropFilter: `blur(${props.blur}px) saturate(180%)`,
}))
</script>

<template>
    <div class="background__filter" :style="filterStyle" />
</template>

<style scoped>
.background__filter {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
}
</style>
