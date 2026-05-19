<script setup lang="ts">
withDefaults(defineProps<{
    dark?: boolean
    flush?: boolean
    elevated?: boolean
}>(), {
    dark: false,
    flush: false,
    elevated: false,
})
</script>

<template>
    <div
        class="ios-card"
        :class="{
            'ios-card--dark':     dark,
            'ios-card--flush':    flush,
            'ios-card--elevated': elevated,
        }"
    >
        <slot />
    </div>
</template>

<style scoped>
.ios-card {
    background: var(--ui-bg-secondary);
    border-radius: var(--ui-radius);
    overflow: hidden;
    box-shadow: var(--ui-shadow-xs);
}

.ios-card--elevated {
    box-shadow: var(--ui-shadow);
}

.ios-card--dark {
    background: var(--ui-bg-elevated);
}

.ios-card--flush {
    border-radius: 0;
    box-shadow: none;
}
</style>
