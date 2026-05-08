<script setup lang="ts">
export type UiButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiButtonVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
export type UiButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

withDefaults(defineProps<{
    color?: UiButtonColor
    variant?: UiButtonVariant
    size?: UiButtonSize
    label?: string
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    loading?: boolean
    loadingIcon?: string
    disabled?: boolean
    block?: boolean
    square?: boolean
    type?: 'button' | 'submit' | 'reset'
    class?: string
}>(), {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
    square: false,
    type: 'button',
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UButton v-bind="{ ...$props, ...$attrs }">
        <template v-if="$slots.default" #default="slotData">
            <slot v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.leading" #leading="slotData">
            <slot name="leading" v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.trailing" #trailing="slotData">
            <slot name="trailing" v-bind="slotData ?? {}" />
        </template>
    </UButton>
</template>
