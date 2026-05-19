<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    /** Show tick marks along the unfilled track */
    showTicks?: boolean
    disabled?: boolean
}>(), {
    min: 0,
    max: 100,
    step: 1,
    showTicks: false,
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: number]
    'change': [value: number]
}>()

const fillPct = computed(() =>
    ((props.modelValue - props.min) / (props.max - props.min)) * 100
)

// Tick positions (excluding first & last — they coincide with track ends)
const ticks = computed(() => {
    if (!props.showTicks) return []
    const count = Math.round((props.max - props.min) / props.step) + 1
    return Array.from({ length: count }, (_, i) =>
        (i / (count - 1)) * 100
    )
})

const onInput = (e: Event) => {
    const val = parseFloat((e.target as HTMLInputElement).value)
    emit('update:modelValue', val)
}

const onChange = (e: Event) => {
    const val = parseFloat((e.target as HTMLInputElement).value)
    emit('change', val)
}

// Inline style injects --fill-pct for the CSS gradient
const trackStyle = computed(() => ({
    '--fill-pct': `${fillPct.value}%`,
}))
</script>

<template>
    <div class="slider-root" :class="{ 'slider-root--disabled': disabled }">
        <!-- Min icon slot -->
        <span v-if="$slots['min-icon']" class="slider-icon slider-icon--min">
            <slot name="min-icon" />
        </span>

        <div class="slider-wrap">
            <!-- Native input (provides drag + accessibility) -->
            <input
                class="slider-input"
                type="range"
                :min="min"
                :max="max"
                :step="step"
                :value="modelValue"
                :disabled="disabled"
                :style="trackStyle"
                @input="onInput"
                @change="onChange"
            />

            <!-- Tick marks rendered under the track -->
            <div v-if="showTicks && ticks.length" class="slider-ticks" aria-hidden="true">
                <span
                    v-for="(pct, i) in ticks"
                    :key="i"
                    class="slider-tick"
                    :class="{ 'slider-tick--filled': pct <= fillPct }"
                    :style="{ left: `${pct}%` }"
                />
            </div>
        </div>

        <!-- Max icon slot -->
        <span v-if="$slots['max-icon']" class="slider-icon slider-icon--max">
            <slot name="max-icon" />
        </span>
    </div>
</template>

<style scoped>
/* ── Root layout ── */
.slider-root {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

.slider-root--disabled {
    opacity: 0.4;
    pointer-events: none;
}

/* ── Icons ── */
.slider-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(60, 60, 67, 0.5);
    width: 20px;
    height: 20px;
}

/* ── Track wrapper (relative, holds input + ticks) ── */
.slider-wrap {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    /* Extra bottom space for ticks */
    padding-bottom: 10px;
}

/* ── Native range input — completely re-skinned ── */
.slider-input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 9999px;
    outline: none;
    border: none;
    cursor: pointer;
    position: relative;
    z-index: 1;

    /* Two-tone track via gradient: fill (blue) → unfill (gray) */
    background: linear-gradient(
        to right,
        #007aff 0%,
        #007aff var(--fill-pct, 0%),
        rgba(120, 120, 128, 0.22) var(--fill-pct, 0%),
        rgba(120, 120, 128, 0.22) 100%
    );

    transition: background 0s; /* gradient updates instantly */
}

/* ── Thumb — WebKit (Chrome / CEF) ── */
.slider-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow:
        0 3px 10px rgba(0, 0, 0, 0.22),
        0 1px 3px rgba(0, 0, 0, 0.15),
        0 0 0 0.5px rgba(0, 0, 0, 0.06);
    cursor: grab;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.slider-input::-webkit-slider-thumb:active {
    cursor: grabbing;
    transform: scale(1.08);
    box-shadow:
        0 5px 16px rgba(0, 0, 0, 0.28),
        0 1px 4px rgba(0, 0, 0, 0.18),
        0 0 0 0.5px rgba(0, 0, 0, 0.06);
}

/* ── Thumb — Firefox ── */
.slider-input::-moz-range-thumb {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #ffffff;
    box-shadow:
        0 3px 10px rgba(0, 0, 0, 0.22),
        0 1px 3px rgba(0, 0, 0, 0.15);
    cursor: grab;
}

/* ── Tick marks ── */
.slider-ticks {
    position: absolute;
    /* Vertically below the track centre (track is 4px, sits at vertical centre of slider-wrap) */
    top: calc(50% + 4px);
    left: 14px;  /* half thumb width — aligns ticks with track start */
    right: 14px; /* half thumb width — aligns ticks with track end */
    height: 4px;
    pointer-events: none;
}

.slider-tick {
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(120, 120, 128, 0.3);
    transform: translateX(-50%);
    transition: background 0.2s ease;
}

.slider-tick--filled {
    background: rgba(0, 122, 255, 0.45);
}

/* ════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
    .slider-input {
        background: linear-gradient(
            to right,
            #0a84ff 0%,
            #0a84ff var(--fill-pct, 0%),
            rgba(120, 120, 128, 0.4) var(--fill-pct, 0%),
            rgba(120, 120, 128, 0.4) 100%
        );
    }

    .slider-input::-webkit-slider-thumb {
        background: #ffffff;
        box-shadow:
            0 3px 12px rgba(0, 0, 0, 0.5),
            0 1px 4px rgba(0, 0, 0, 0.35),
            0 0 0 0.5px rgba(255, 255, 255, 0.1);
    }

    .slider-input::-moz-range-thumb {
        background: #ffffff;
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
    }

    .slider-icon {
        color: rgba(235, 235, 245, 0.4);
    }

    .slider-tick {
        background: rgba(120, 120, 128, 0.45);
    }

    .slider-tick--filled {
        background: rgba(10, 132, 255, 0.5);
    }
}
</style>
