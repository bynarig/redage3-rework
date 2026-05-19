<script setup lang="ts">
import { computed } from 'vue'

export type IosProgressColor = 'accent' | 'success' | 'warning' | 'destructive' | 'neutral'
export type IosProgressSize = 'xs' | 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
    value?: number
    color?: IosProgressColor
    size?: IosProgressSize
    animated?: boolean
    striped?: boolean
    label?: string
    showValue?: boolean
    indeterminate?: boolean
}>(), {
    value: 0,
    color: 'accent',
    size: 'md',
    animated: false,
    striped: false,
    showValue: false,
    indeterminate: false,
})

const clamped = computed(() => Math.min(100, Math.max(0, props.value ?? 0)))
</script>

<template>
    <div class="ios-progress" :class="`ios-progress--${size}`">
        <div v-if="label || showValue" class="ios-progress__header">
            <span v-if="label" class="ios-progress__label">{{ label }}</span>
            <span v-if="showValue && !indeterminate" class="ios-progress__pct">{{ Math.round(clamped) }}%</span>
        </div>
        <div
            class="ios-progress__track"
            role="progressbar"
            :aria-valuenow="indeterminate ? undefined : clamped"
            aria-valuemin="0"
            aria-valuemax="100"
        >
            <div
                class="ios-progress__fill"
                :class="[
                    `ios-progress__fill--${color}`,
                    {
                        'ios-progress__fill--striped': striped,
                        'ios-progress__fill--animated': animated,
                        'ios-progress__fill--indeterminate': indeterminate,
                    },
                ]"
                :style="!indeterminate ? { width: `${clamped}%` } : undefined"
            />
        </div>
    </div>
</template>

<style scoped>
.ios-progress {
    display: flex;
    flex-direction: column;
}

.ios-progress__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
}

.ios-progress__label {
    font-size: 13px;
    font-family: var(--ui-font);
    font-weight: var(--ui-fw-medium);
    color: var(--ui-label);
}

.ios-progress__pct {
    font-size: 13px;
    font-family: var(--ui-font);
    color: var(--ui-label-secondary);
    font-variant-numeric: tabular-nums;
}

.ios-progress__track {
    position: relative;
    width: 100%;
    background: var(--ui-fill-tertiary);
    border-radius: 9999px;
    overflow: hidden;
}

.ios-progress--xs .ios-progress__track { height: 2px; }
.ios-progress--sm .ios-progress__track { height: 4px; }
.ios-progress--md .ios-progress__track { height: 6px; }
.ios-progress--lg .ios-progress__track { height: 10px; }

.ios-progress__fill {
    height: 100%;
    border-radius: 9999px;
    transition: width var(--ui-dur-slow) var(--ui-ease);
}

/* Color variants */
.ios-progress__fill--accent      { background-color: var(--ui-accent); }
.ios-progress__fill--success     { background-color: var(--ui-success); }
.ios-progress__fill--warning     { background-color: var(--ui-warning); }
.ios-progress__fill--destructive { background-color: var(--ui-destructive); }
.ios-progress__fill--neutral     { background-color: var(--ui-neutral); }

/* Stripe overlay — composites on top of background-color */
.ios-progress__fill--striped {
    background-image: repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.18) 0px,
        rgba(255, 255, 255, 0.18) 10px,
        transparent 10px,
        transparent 20px
    );
}

/* Stripe movement — only when both striped and animated */
.ios-progress__fill--striped.ios-progress__fill--animated {
    animation: ios-stripe 0.5s linear infinite;
}

@keyframes ios-stripe {
    from { background-position: 0 0; }
    to   { background-position: 28px 28px; }
}

/* Indeterminate — fill becomes a sliding 30% bar */
.ios-progress__fill--indeterminate {
    width: 30%;
    transition: none;
    animation: ios-indeterminate 1.6s ease-in-out infinite;
}

@keyframes ios-indeterminate {
    0%   { transform: translateX(-200%); }
    75%  { transform: translateX(430%); }
    100% { transform: translateX(430%); }
}
</style>
