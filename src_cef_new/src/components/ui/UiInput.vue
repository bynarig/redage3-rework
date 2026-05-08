<script setup lang="ts">
export type UiInputColor = 'primary' | 'error' | 'neutral'
export type UiInputVariant = 'outline' | 'soft' | 'subtle' | 'none'
export type UiInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<string | number | undefined>({ default: '' })

withDefaults(defineProps<{
    placeholder?: string
    type?: string
    color?: UiInputColor
    variant?: UiInputVariant
    size?: UiInputSize
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    loading?: boolean
    highlight?: boolean
    disabled?: boolean
    readonly?: boolean
    autocomplete?: string
    autofocus?: boolean
    clearable?: boolean
    class?: string
}>(), {
    type: 'text',
    color: 'primary',
    variant: 'outline',
    size: 'md',
    loading: false,
    disabled: false,
    readonly: false,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UInput v-bind="{ ...$props, ...$attrs }" v-model="model">
        <template v-if="$slots.leading" #leading="slotData">
            <slot name="leading" v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.trailing" #trailing="slotData">
            <slot name="trailing" v-bind="slotData ?? {}" />
        </template>
    </UInput>
</template>
