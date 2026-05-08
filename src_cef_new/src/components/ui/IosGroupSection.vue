<script setup lang="ts">
import IosCard from './IosCard.vue'

withDefaults(defineProps<{
    title?: string
    footer?: string
    inset?: boolean
}>(), {
    inset: false,
})
</script>

<template>
    <div class="ios-group" :class="{ 'ios-group--inset': inset }">
        <div v-if="$slots.title || title" class="ios-group__title">
            <slot name="title">{{ title }}</slot>
        </div>
        <IosCard flush>
            <slot />
        </IosCard>
        <div v-if="$slots.footer || footer" class="ios-group__footer">
            <slot name="footer">{{ footer }}</slot>
        </div>
    </div>
</template>

<style scoped>
.ios-group {
    display: flex;
    flex-direction: column;
}

.ios-group--inset {
    padding-left: 16px;
    padding-right: 16px;
}

.ios-group__title {
    padding: 8px 16px 5px;
    font-size: 13px;
    font-weight: var(--ui-fw-semibold);
    font-family: var(--ui-font);
    color: var(--ui-label-secondary);
    letter-spacing: 0.05em;
    text-transform: uppercase;
}

.ios-group--inset .ios-group__title {
    padding-left: 0;
}

.ios-group__footer {
    padding: 8px 16px;
    font-size: 13px;
    font-family: var(--ui-font);
    color: var(--ui-label-tertiary);
    line-height: 1.45;
}

.ios-group--inset .ios-group__footer {
    padding-left: 0;
}
</style>
