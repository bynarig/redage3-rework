<script setup lang="ts">
export type UiAlertColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiAlertVariant = 'solid' | 'outline' | 'soft' | 'subtle'
export type UiAlertOrientation = 'horizontal' | 'vertical'

withDefaults(defineProps<{
    title?: string
    description?: string
    color?: UiAlertColor
    variant?: UiAlertVariant
    icon?: string
    orientation?: UiAlertOrientation
    actions?: Array<{ label: string; color?: string; variant?: string; onClick?: () => void }>
    class?: string
}>(), {
    color: 'primary',
    variant: 'soft',
    orientation: 'horizontal',
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UAlert v-bind="{ ...$props, ...$attrs }">
        <template v-if="$slots.title" #title>
            <slot name="title" />
        </template>
        <template v-if="$slots.description" #description>
            <slot name="description" />
        </template>
        <template v-if="$slots.icon" #icon="slotData">
            <slot name="icon" v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.actions" #actions>
            <slot name="actions" />
        </template>
    </UAlert>
</template>
