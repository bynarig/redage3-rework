<script setup lang="ts">
export type UiSelectColor = 'primary' | 'error' | 'neutral'
export type UiSelectVariant = 'outline' | 'soft' | 'subtle' | 'none'
export type UiSelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<string | number | object | undefined>()

withDefaults(defineProps<{
    items?: Array<string | number | { label: string; value?: unknown; disabled?: boolean; icon?: string }>
    placeholder?: string
    valueKey?: string
    labelKey?: string
    color?: UiSelectColor
    variant?: UiSelectVariant
    size?: UiSelectSize
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    searchable?: boolean
    multiple?: boolean
    clearable?: boolean
    disabled?: boolean
    required?: boolean
    loading?: boolean
    arrow?: boolean
    class?: string
}>(), {
    items: () => [],
    color: 'primary',
    variant: 'outline',
    size: 'md',
    searchable: false,
    multiple: false,
    clearable: false,
    disabled: false,
    arrow: true,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <USelect v-bind="{ ...($props as any), ...$attrs }" v-model="model">
        <template v-if="$slots.leading" #leading="slotData">
            <slot name="leading" v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.trailing" #trailing="slotData">
            <slot name="trailing" v-bind="slotData ?? {}" />
        </template>
        <template v-if="$slots.item" #item="slotData">
            <slot name="item" v-bind="slotData ?? {}" />
        </template>
    </USelect>
</template>
