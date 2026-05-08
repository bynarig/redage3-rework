<script setup lang="ts">
export type UiCheckboxColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiCheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<boolean | 'indeterminate'>({ default: false })

withDefaults(defineProps<{
    label?: string
    description?: string
    // value?: unknown
    indeterminate?: boolean
    required?: boolean
    disabled?: boolean
    color?: UiCheckboxColor
    size?: UiCheckboxSize
    class?: string
}>(), {
    color: 'primary',
    size: 'md',
    disabled: false,
    required: false,
    indeterminate: false,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UCheckbox v-bind="{ ...$props, ...$attrs }" v-model="model">
        <template v-if="$slots.label" #label="slotData">
            <slot name="label" v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.description" #description="slotData">
            <slot name="description" v-bind="slotData ?? {}" />
        </template>
    </UCheckbox>
</template>
