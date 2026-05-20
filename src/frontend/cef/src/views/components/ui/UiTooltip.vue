<script setup lang="ts">
import { ref } from 'vue'

const open = defineModel<boolean>('open', { default: false })

withDefaults(defineProps<{
    text?: string
    delay?: number | { open?: number; close?: number }
    disabled?: boolean
    arrow?: boolean
    kbds?: string[]
    placement?: 'top' | 'bottom' | 'left' | 'right'
    class?: string
}>(), {
    disabled: false,
    arrow: false,
    delay: 0,
    placement: 'top',
})

defineOptions({ inheritAttrs: false })

const openTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function show(d: number) {
    if (closeTimer.value) clearTimeout(closeTimer.value)
    if (openTimer.value) clearTimeout(openTimer.value)
    openTimer.value = setTimeout(() => { open.value = true }, d)
}
function hide(d: number) {
    if (openTimer.value) clearTimeout(openTimer.value)
    closeTimer.value = setTimeout(() => { open.value = false }, d)
}
</script>

<template>
    <span
        class="ui-tooltip"
        :class="[`ui-tooltip--p-${placement}`, { 'ui-tooltip--open': open }, $props.class]"
        v-bind="$attrs"
        @mouseenter="!disabled && show(typeof delay === 'number' ? delay : (delay?.open ?? 0))"
        @mouseleave="hide(typeof delay === 'number' ? 0 : (delay?.close ?? 80))"
        @focusin="!disabled && show(0)"
        @focusout="hide(0)"
    >
        <slot />
        <span v-if="(text || $slots.content) && !disabled" class="ui-tooltip__bubble" role="tooltip">
            <slot name="content">{{ text }}</slot>
            <span v-if="kbds && kbds.length" class="ui-tooltip__kbds">
                <kbd v-for="(k, i) in kbds" :key="i" class="ui-tooltip__kbd">{{ k }}</kbd>
            </span>
            <span v-if="arrow" class="ui-tooltip__arrow" aria-hidden="true" />
        </span>
    </span>
</template>

<style lang="scss" scoped>
.ui-tooltip {
    position: relative;
    display: inline-flex;

    &__bubble {
        position: absolute;
        z-index: 60;
        padding: 7px 11px;
        background: var(--glass-strong-bg);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: var(--glass-radius-sm);
        box-shadow: var(--glass-shadow);
        font-family: var(--ui-font);
        font-size: 12px;
        color: var(--glass-text);
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transform: scale(0.94);
        transform-origin: center bottom;
        transition: opacity 160ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    &--p-top    .ui-tooltip__bubble { bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%) scale(0.94); }
    &--p-bottom .ui-tooltip__bubble { top:    calc(100% + 8px); left: 50%; transform: translateX(-50%) scale(0.94); transform-origin: center top; }
    &--p-left   .ui-tooltip__bubble { right:  calc(100% + 8px); top: 50%; transform: translateY(-50%) scale(0.94); transform-origin: right center; }
    &--p-right  .ui-tooltip__bubble { left:   calc(100% + 8px); top: 50%; transform: translateY(-50%) scale(0.94); transform-origin: left center; }

    &--open .ui-tooltip__bubble {
        opacity: 1;
    }
    &--open.ui-tooltip--p-top    .ui-tooltip__bubble { transform: translateX(-50%) scale(1); }
    &--open.ui-tooltip--p-bottom .ui-tooltip__bubble { transform: translateX(-50%) scale(1); }
    &--open.ui-tooltip--p-left   .ui-tooltip__bubble { transform: translateY(-50%) scale(1); }
    &--open.ui-tooltip--p-right  .ui-tooltip__bubble { transform: translateY(-50%) scale(1); }

    &__arrow {
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--glass-strong-bg);
        border: 1px solid var(--glass-border);
        transform: rotate(45deg);
    }

    &--p-top    .ui-tooltip__arrow { bottom: -5px; left: 50%; margin-left: -4px; border-top: 0; border-left: 0; }
    &--p-bottom .ui-tooltip__arrow { top:    -5px; left: 50%; margin-left: -4px; border-bottom: 0; border-right: 0; }
    &--p-left   .ui-tooltip__arrow { right:  -5px; top: 50%; margin-top: -4px; border-bottom: 0; border-left: 0; }
    &--p-right  .ui-tooltip__arrow { left:   -5px; top: 50%; margin-top: -4px; border-top: 0; border-right: 0; }

    &__kbds {
        display: inline-flex;
        gap: 3px;
    }

    &__kbd {
        font-family: var(--ui-font-mono);
        font-size: 10px;
        padding: 1px 5px;
        background: var(--glass-recessed-bg);
        border: 1px solid var(--glass-border-soft);
        border-radius: 4px;
        color: var(--glass-text-muted);
    }
}
</style>
