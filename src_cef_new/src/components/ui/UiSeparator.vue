<script setup lang="ts">
export type UiSeparatorColor = 'primary' | 'neutral'
export type UiSeparatorType = 'solid' | 'dashed' | 'dotted'
export type UiSeparatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type UiSeparatorOrientation = 'horizontal' | 'vertical'

withDefaults(defineProps<{
    label?: string
    color?: UiSeparatorColor
    type?: UiSeparatorType
    size?: UiSeparatorSize
    orientation?: UiSeparatorOrientation
    icon?: string
    decorative?: boolean
    class?: string
}>(), {
    color: 'neutral',
    type: 'solid',
    size: 'xs',
    orientation: 'horizontal',
    decorative: false,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <USeparator v-bind="{ ...$props, ...$attrs }">
        <template v-if="$slots.default" #default>
            <slot />
        </template>
    </USeparator>
</template>
