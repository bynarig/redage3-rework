<script setup lang="ts">
export type UiToggleColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
export type UiToggleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<boolean>({ default: false })

withDefaults(defineProps<{
    label?: string
    description?: string
    disabled?: boolean
    required?: boolean
    color?: UiToggleColor
    size?: UiToggleSize
    class?: string
}>(), {
    color: 'primary',
    size: 'md',
    disabled: false,
    required: false,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <USwitch v-bind="{ ...$props, ...$attrs }" v-model="model">
        <template v-if="$slots.label" #label="slotData">
            <slot name="label" v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.description" #description="slotData">
            <slot name="description" v-bind="slotData ?? {}" />
        </template>
    </USwitch>
</template>
