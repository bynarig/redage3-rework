<script setup lang="ts">
import { computed } from 'vue'

export type SegmentItem = string | { label: string; disabled?: boolean }

const props = withDefaults(defineProps<{
    /** Array of labels or {label, disabled} objects */
    segments: SegmentItem[]
    /** Currently selected index (0-based) — use with v-model */
    modelValue: number
    /** Disable the entire control */
    disabled?: boolean
}>(), {
    modelValue: 0,
    disabled: false,
})

const emit = defineEmits<{
    'update:modelValue': [index: number]
}>()

const items = computed(() =>
    props.segments.map((s, i) =>
        typeof s === 'string'
            ? { label: s, disabled: false, index: i }
            : { label: s.label, disabled: s.disabled ?? false, index: i }
    )
)

const select = (index: number) => {
    if (!props.disabled && !items.value[index]?.disabled && index !== props.modelValue) {
        emit('update:modelValue', index)
    }
}

// CSS custom-property values for the sliding indicator
const trackVars = computed(() => ({
    '--n':   String(props.segments.length),
    '--sel': String(props.modelValue),
}))
</script>

<template>
    <div
        class="seg"
        :class="{ 'seg--disabled': disabled }"
        :style="trackVars"
        role="tablist"
    >
        <!-- Sliding indicator -->
        <div class="seg__indicator" aria-hidden="true" />

        <!-- Segment buttons -->
        <button
            v-for="item in items"
            :key="item.index"
            class="seg__item"
            :class="{
                'seg__item--selected': item.index === modelValue,
                'seg__item--disabled': item.disabled,
            }"
            role="tab"
            :aria-selected="item.index === modelValue"
            :disabled="disabled || item.disabled"
            @click="select(item.index)"
        >
            <span class="seg__label">{{ item.label }}</span>
        </button>
    </div>
</template>

<style scoped>
/* ── Container ── */
.seg {
    display: flex;
    position: relative;
    background: rgba(120, 120, 128, 0.12);
    border-radius: 9999px;
    padding: 2px;
    gap: 0;
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

.seg--disabled {
    opacity: 0.4;
    pointer-events: none;
}

/* ── Sliding indicator (the white pill) ── */
.seg__indicator {
    position: absolute;
    top: 2px;
    bottom: 2px;
    /* width  = (100% minus left+right padding) / number-of-segments */
    width: calc((100% - 4px) / var(--n));
    /* left   = padding + selectedIndex × one-segment-width */
    left: calc(2px + var(--sel) * ((100% - 4px) / var(--n)));
    border-radius: 9999px;
    background: #ffffff;
    box-shadow:
        0 1px 4px rgba(0, 0, 0, 0.14),
        0 0 0 0.5px rgba(0, 0, 0, 0.04);
    transition:
        left 0.24s cubic-bezier(0.34, 1.1, 0.64, 1);
    pointer-events: none;
    will-change: left;
}

/* ── Segment button ── */
.seg__item {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    border: none;
    background: transparent;
    border-radius: 9999px;
    cursor: pointer;
    transition: opacity 0.15s ease;
    min-width: 0;
}

.seg__item:active:not(.seg__item--selected):not(.seg__item--disabled) {
    opacity: 0.6;
}

.seg__item--disabled {
    cursor: not-allowed;
    opacity: 0.38;
}

/* ── Label ── */
.seg__label {
    font-size: 13px;
    font-weight: 500;
    color: #1d1d1f;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: font-weight 0.15s ease, color 0.15s ease;
    pointer-events: none;
}

.seg__item--selected .seg__label {
    font-weight: 600;
    color: #1d1d1f;
}

/* Unselected labels are slightly muted */
.seg__item:not(.seg__item--selected) .seg__label {
    color: rgba(60, 60, 67, 0.6);
}

/* ════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
    .seg {
        background: rgba(120, 120, 128, 0.24);
    }

    .seg__indicator {
        background: rgba(255, 255, 255, 0.14);
        box-shadow:
            0 1px 3px rgba(0, 0, 0, 0.35),
            0 0 0 0.5px rgba(255, 255, 255, 0.08);
    }

    .seg__item--selected .seg__label {
        color: #ffffff;
    }

    .seg__item:not(.seg__item--selected) .seg__label {
        color: rgba(235, 235, 245, 0.5);
    }
}
</style>
