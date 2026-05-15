<script setup lang="ts">
export type UiTooltipSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const open = defineModel<boolean>('open', { default: false })

withDefaults(defineProps<{
    text?: string
    delay?: number | { open?: number; close?: number }
    disabled?: boolean
    arrow?: boolean
    kbds?: string[]
    class?: string
}>(), {
    disabled: false,
    arrow: false,
    delay: 0,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UTooltip v-bind="{ ...$props, ...$attrs }" v-model:open="open">
        <slot />
        <template v-if="$slots.content" #content>
            <slot name="content" />
        </template>
    </UTooltip>
</template>
