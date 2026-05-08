<script setup lang="ts">
export type UiTextareaColor = 'primary' | 'error' | 'neutral'
export type UiTextareaVariant = 'outline' | 'soft' | 'subtle' | 'none'
export type UiTextareaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<string | undefined>({ default: undefined })

withDefaults(defineProps<{
    placeholder?: string
    rows?: number
    color?: UiTextareaColor
    variant?: UiTextareaVariant
    size?: UiTextareaSize
    loading?: boolean
    highlight?: boolean
    disabled?: boolean
    readonly?: boolean
    autofocus?: boolean
    autoresize?: boolean
    maxrows?: number
    class?: string
}>(), {
    rows: 3,
    color: 'primary',
    variant: 'outline',
    size: 'md',
    disabled: false,
    readonly: false,
    autoresize: false,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UTextarea v-bind="{ ...$props, ...$attrs }" v-model="model" />
</template>
