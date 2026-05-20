<script setup lang="ts">
import { computed } from 'vue'

export type UiAvatarSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type UiAvatarChipPosition = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
export type UiAvatarChipColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

const props = withDefaults(defineProps<{
    src?: string
    alt?: string
    text?: string
    icon?: string
    size?: UiAvatarSize
    chipColor?: UiAvatarChipColor
    chipPosition?: UiAvatarChipPosition
    chipText?: string
    class?: string
}>(), {
    size: 'md',
    chipPosition: 'bottom-right',
})

defineOptions({ inheritAttrs: false })

const initials = computed(() => {
    if (props.text) {
        return props.text
            .split(/\s+/)
            .map(w => w[0])
            .filter(Boolean)
            .slice(0, 2)
            .join('')
            .toUpperCase()
    }
    return ''
})

const classList = computed(() => [
    'ui-avatar',
    `ui-avatar--s-${props.size}`,
    props.class,
])

const chipClass = computed(() => [
    'ui-avatar__chip',
    `ui-avatar__chip--p-${props.chipPosition}`,
    `ui-avatar__chip--c-${props.chipColor ?? 'success'}`,
])
</script>

<template>
    <span :class="classList" v-bind="$attrs">
        <img v-if="src" :src="src" :alt="alt" class="ui-avatar__img" />
        <span v-else-if="icon" class="ui-avatar__icon">{{ icon }}</span>
        <span v-else class="ui-avatar__text">{{ initials }}</span>
        <span v-if="chipColor || chipText" :class="chipClass" :data-chip="chipText">
            <span v-if="chipText" class="ui-avatar__chip-text">{{ chipText }}</span>
        </span>
    </span>
</template>

<style lang="scss" scoped>
.ui-avatar {
    --_size: 36px;

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--_size);
    height: var(--_size);
    flex: 0 0 auto;
    border-radius: 50%;
    background: var(--glass-pane-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    border: 1px solid var(--glass-border);
    overflow: hidden;
    color: var(--glass-text);
    font-weight: 600;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.10), 0 1px 0 var(--glass-rim-top) inset;
    isolation: isolate;

    &--s-3xs { --_size: 16px; font-size: 8px; }
    &--s-2xs { --_size: 20px; font-size: 9px; }
    &--s-xs  { --_size: 26px; font-size: 11px; }
    &--s-sm  { --_size: 32px; font-size: 12px; }
    &--s-md  { --_size: 40px; font-size: 14px; }
    &--s-lg  { --_size: 48px; font-size: 16px; }
    &--s-xl  { --_size: 60px; font-size: 18px; }
    &--s-2xl { --_size: 76px; font-size: 22px; }
    &--s-3xl { --_size: 96px; font-size: 28px; }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: inherit;
    }

    &__text {
        font-family: var(--ui-font);
    }

    &__icon {
        font-size: 1.1em;
    }

    &__chip {
        position: absolute;
        min-width: 28%;
        min-height: 28%;
        padding: 0 4px;
        border-radius: 999px;
        background: var(--glass-success);
        border: 2px solid var(--glass-strong-bg);
        color: var(--glass-text-on-tint);
        font-size: 9px;
        font-weight: 600;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;

        &--p-top-right    { top: -2px; right: -2px; }
        &--p-bottom-right { bottom: -2px; right: -2px; }
        &--p-top-left     { top: -2px; left: -2px; }
        &--p-bottom-left  { bottom: -2px; left: -2px; }

        &--c-primary   { background: var(--glass-accent); }
        &--c-secondary { background: var(--glass-info); }
        &--c-success   { background: var(--glass-success); }
        &--c-info      { background: var(--glass-info); }
        &--c-warning   { background: var(--glass-warning); }
        &--c-error     { background: var(--glass-danger); }
        &--c-neutral   { background: var(--glass-text); }
    }
}
</style>
