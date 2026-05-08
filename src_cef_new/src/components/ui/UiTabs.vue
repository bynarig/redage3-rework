<script setup lang="ts">
export type UiTabsColor = 'primary' | 'secondary' | 'neutral'
export type UiTabsVariant = 'pill' | 'link' | 'underline'
export type UiTabsSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type UiTabsOrientation = 'horizontal' | 'vertical'

export interface UiTabItem {
    label?: string
    value?: string | number
    icon?: string
    disabled?: boolean
    slot?: string
    content?: string
}

const model = defineModel<string | number>()

withDefaults(defineProps<{
    items?: UiTabItem[]
    color?: UiTabsColor
    variant?: UiTabsVariant
    size?: UiTabsSize
    orientation?: UiTabsOrientation
    class?: string
}>(), {
    items: () => [],
    color: 'primary',
    variant: 'pill',
    size: 'md',
    orientation: 'horizontal',
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UTabs v-bind="{ ...$props, ...$attrs }" v-model="model">
        <template v-for="(_, name) in $slots" :key="String(name)" #[name]="slotData">
            <slot :name="name" v-bind="slotData ?? {}" />
        </template>
    </UTabs>
</template>
