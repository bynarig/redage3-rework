<script setup lang="ts">
import './main.scss'
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    tag?: string
    zIndex?: number
    pointerEvents?: boolean
}>(), {
    tag: 'div',
    pointerEvents: true,
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const containerStyle = computed(() => ({
    ...(props.zIndex !== undefined && { zIndex: props.zIndex }),
    pointerEvents: props.pointerEvents ? 'auto' : 'none',
}))
</script>

<template>
    <component
        :is="tag"
        id="animcontainer"
        class="animcontainer"
        :style="containerStyle"
        @click="emit('click', $event)"
    >
        <slot />
    </component>
</template>

<style scoped>
.animcontainer {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}
</style>
