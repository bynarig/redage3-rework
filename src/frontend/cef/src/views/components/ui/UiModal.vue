<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })

withDefaults(defineProps<{
    title?: string
    description?: string
    fullscreen?: boolean
    dismissible?: boolean
    preventClose?: boolean
    overlay?: boolean
    class?: string
}>(), {
    fullscreen: false,
    dismissible: true,
    preventClose: false,
    overlay: true,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UModal v-model:open="open" v-bind="{ ...$props, ...$attrs }">
        <template v-if="$slots.default" #default>
            <slot />
        </template>
        <template v-if="$slots.header" #header>
            <slot name="header" />
        </template>
        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
        <template v-if="$slots.close" #close="slotData">
            <slot name="close" v-bind="slotData ?? {}" />
        </template>
    </UModal>
</template>
