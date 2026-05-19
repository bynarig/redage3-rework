<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    disabled?: boolean
}>(), {
    step: 1,
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: number]
    'decrement': []
    'increment': []
}>()

const canDecrement = computed(() =>
    !props.disabled && (props.min === undefined || props.modelValue - props.step >= props.min)
)

const canIncrement = computed(() =>
    !props.disabled && (props.max === undefined || props.modelValue + props.step <= props.max)
)

const decrement = () => {
    if (canDecrement.value) {
        emit('update:modelValue', props.modelValue - props.step)
        emit('decrement')
    }
}

const increment = () => {
    if (canIncrement.value) {
        emit('update:modelValue', props.modelValue + props.step)
        emit('increment')
    }
}
</script>

<template>
    <div class="stepper" :class="{ 'stepper--disabled': disabled }">
        <button
            class="stepper__btn stepper__btn--dec"
            :class="{ 'stepper__btn--unavailable': !canDecrement }"
            :disabled="!canDecrement"
            aria-label="Decrement"
            @click="decrement"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
        </button>

        <div class="stepper__divider" aria-hidden="true" />

        <button
            class="stepper__btn stepper__btn--inc"
            :class="{ 'stepper__btn--unavailable': !canIncrement }"
            :disabled="!canIncrement"
            aria-label="Increment"
            @click="increment"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor" />
                <rect x="7.25" y="2" width="1.5" height="12" rx="0.75" fill="currentColor" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
.stepper {
    display: inline-flex;
    align-items: center;
    background: rgba(120, 120, 128, 0.16);
    border-radius: 9999px;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.stepper--disabled {
    opacity: 0.38;
    pointer-events: none;
}

/* Buttons */
.stepper__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 32px;
    border: none;
    background: transparent;
    cursor: pointer;
    color: #1d1d1f;
    transition: background 0.12s ease, transform 0.08s ease;
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
}

.stepper__btn--dec { border-radius: 9999px 0 0 9999px; }
.stepper__btn--inc { border-radius: 0 9999px 9999px 0; }

.stepper__btn:active:not(.stepper__btn--unavailable) {
    background: rgba(120, 120, 128, 0.22);
    transform: scale(0.94);
}

.stepper__btn--unavailable {
    opacity: 0.28;
    cursor: default;
    pointer-events: none;
}

/* Vertical divider */
.stepper__divider {
    width: 0.5px;
    height: 20px;
    background: rgba(60, 60, 67, 0.2);
    flex-shrink: 0;
}

/* ════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
    .stepper {
        background: rgba(120, 120, 128, 0.32);
    }

    .stepper__btn {
        color: #ffffff;
    }

    .stepper__btn:active:not(.stepper__btn--unavailable) {
        background: rgba(255, 255, 255, 0.12);
    }

    .stepper__divider {
        background: rgba(235, 235, 245, 0.18);
    }
}
</style>
