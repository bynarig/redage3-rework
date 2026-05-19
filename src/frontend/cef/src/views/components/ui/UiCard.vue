<script setup lang="ts">
withDefaults(defineProps<{
    title?: string
    description?: string
    highlight?: boolean
    class?: string
}>(), {
    highlight: false,
})

defineOptions({ inheritAttrs: false })
</script>

<template>
    <UCard v-bind="{ ...$props, ...$attrs }">
        <template v-if="$slots.header" #header>
            <slot name="header" />
        </template>

        <slot />

        <template v-if="$slots.footer" #footer>
            <slot name="footer" />
        </template>
    </UCard>
</template>
