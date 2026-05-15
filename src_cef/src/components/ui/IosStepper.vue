<script setup lang="ts">
import { computed } from 'vue'

export type IosStepperSize = 'sm' | 'md' | 'lg'

const model = defineModel<number>({ default: 0 })

const props = withDefaults(defineProps<{
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    size?: IosStepperSize
}>(), {
    step: 1,
    disabled: false,
    size: 'md',
})

const canDecrement = computed(() => props.min === undefined || model.value > props.min)
const canIncrement = computed(() => props.max === undefined || model.value < props.max)

function decrement() {
    if (!canDecrement.value || props.disabled) return
    const next = model.value - props.step
    model.value = props.min !== undefined ? Math.max(props.min, next) : next
}

function increment() {
    if (!canIncrement.value || props.disabled) return
    const next = model.value + props.step
    model.value = props.max !== undefined ? Math.min(props.max, next) : next
}
</script>

<template>
    <div
        class="ios-stepper"
        :class="[`ios-stepper--${size}`, { 'ios-stepper--disabled': disabled }]"
    >
        <button
            type="button"
            class="ios-stepper__btn"
            :disabled="disabled || !canDecrement"
            aria-label="Decrease"
            @click="decrement"
        >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8h9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
            </svg>
        </button>

        <span class="ios-stepper__divider" aria-hidden="true" />

        <output class="ios-stepper__value">{{ model }}</output>

        <span class="ios-stepper__divider" aria-hidden="true" />

        <button
            type="button"
            class="ios-stepper__btn"
            :disabled="disabled || !canIncrement"
            aria-label="Increase"
            @click="increment"
        >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 3.5v9M3.5 8h9" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.ios-stepper {
    display: inline-flex;
    align-items: stretch;
    background: var(--ui-bg-secondary);
    border-radius: var(--ui-radius);
    overflow: hidden;
    box-shadow: var(--ui-shadow-xs);
}

.ios-stepper--sm { height: 28px; font-size: 13px; }
.ios-stepper--md { height: 34px; font-size: 15px; }
.ios-stepper--lg { height: 42px; font-size: 17px; }

.ios-stepper__btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--ui-accent);
    transition: background var(--ui-dur-fast), transform var(--ui-dur-fast) var(--ui-ease-spring);
    -webkit-tap-highlight-color: transparent;
}

.ios-stepper--sm .ios-stepper__btn { padding: 0 11px; }
.ios-stepper--md .ios-stepper__btn { padding: 0 13px; }
.ios-stepper--lg .ios-stepper__btn { padding: 0 16px; }

.ios-stepper--sm .ios-stepper__btn svg { width: 14px; height: 14px; }
.ios-stepper--md .ios-stepper__btn svg { width: 16px; height: 16px; }
.ios-stepper--lg .ios-stepper__btn svg { width: 18px; height: 18px; }

.ios-stepper__btn:active:not(:disabled) {
    background: var(--ui-fill-tertiary);
    transform: scale(0.88);
}

.ios-stepper__btn:disabled {
    color: var(--ui-label-quaternary);
    cursor: not-allowed;
}

.ios-stepper__divider {
    width: 0.5px;
    background: var(--ui-separator);
    flex-shrink: 0;
}

.ios-stepper__value {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--ui-font);
    font-weight: var(--ui-fw-medium);
    font-variant-numeric: tabular-nums;
    color: var(--ui-label);
    -webkit-user-select: none;
    user-select: none;
    min-width: 40px;
}

.ios-stepper--disabled {
    opacity: 0.5;
    pointer-events: none;
}
</style>
