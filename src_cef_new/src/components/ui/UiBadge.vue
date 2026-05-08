<script setup lang="ts">
export type UiBadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiBadgeVariant = 'solid' | 'outline' | 'soft' | 'subtle'
export type UiBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

withDefaults(defineProps<{
    label?: string
    color?: UiBadgeColor
    variant?: UiBadgeVariant
    size?: UiBadgeSize
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    class?: string
}>(), {
    color: 'primary',
    variant: 'solid',
    size: 'md',
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UBadge v-bind="{ ...$props, ...$attrs }">
        <slot />
    </UBadge>
</template>
