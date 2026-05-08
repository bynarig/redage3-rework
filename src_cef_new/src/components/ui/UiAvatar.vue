<script setup lang="ts">
export type UiAvatarSize = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type UiAvatarChipPosition = 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'
export type UiAvatarChipColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

withDefaults(defineProps<{
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
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UAvatar v-bind="{ ...$props, ...$attrs }" />
</template>
