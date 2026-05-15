<script setup lang="ts">
import { computed } from 'vue'

export type ButtonVariant = 'filled' | 'tinted' | 'gray' | 'plain'
export type ButtonSize = 'large' | 'medium' | 'small' | 'mini'
export type ButtonColor = 'blue' | 'red' | 'default'
export type ButtonShape = 'pill' | 'rounded' | 'circle'

const props = withDefaults(defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    color?: ButtonColor
    shape?: ButtonShape
    disabled?: boolean
    loading?: boolean
    type?: 'button' | 'submit' | 'reset'
}>(), {
    variant: 'filled',
    size: 'medium',
    color: 'blue',
    shape: 'pill',
    disabled: false,
    loading: false,
    type: 'button',
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()

const onClick = (e: MouseEvent) => {
    if (!props.disabled && !props.loading) emit('click', e)
}

const classes = computed(() => [
    'app-btn',
    `app-btn--${props.variant}`,
    `app-btn--${props.size}`,
    `app-btn--${props.color}`,
    `app-btn--${props.shape}`,
    { 'app-btn--disabled': props.disabled, 'app-btn--loading': props.loading },
])
</script>

<template>
    <button
        :class="classes"
        :type="type"
        :disabled="disabled || loading"
        @click="onClick"
    >
        <span v-if="loading" class="app-btn__spinner" aria-hidden="true" />

        <span v-if="!loading && $slots.icon" class="app-btn__icon" aria-hidden="true">
            <slot name="icon" />
        </span>

        <span v-if="$slots.default && shape !== 'circle'" class="app-btn__label">
            <slot />
        </span>
    </button>
</template>

<style scoped>
/* ─────────────────────────── Base ─────────────────────────── */
.app-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    outline: none;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", Helvetica, Arial, sans-serif;
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
    user-select: none;
    position: relative;
    overflow: hidden;
    -webkit-tap-highlight-color: transparent;
    transition:
        transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94),
        filter 0.12s ease,
        opacity 0.12s ease;
}

.app-btn:active:not(.app-btn--disabled):not(.app-btn--loading) {
    transform: scale(0.96);
    filter: brightness(0.92);
}

/* ─────────────────────────── Sizes ─────────────────────────── */
.app-btn--large  { height: 50px; padding: 0 22px; font-size: 17px; border-radius: 14px; gap: 7px; }
.app-btn--medium { height: 40px; padding: 0 16px; font-size: 15px; border-radius: 12px; gap: 6px; }
.app-btn--small  { height: 32px; padding: 0 14px; font-size: 13px; border-radius: 10px; gap: 5px; }
.app-btn--mini   { height: 26px; padding: 0 11px; font-size: 11px; border-radius: 8px;  gap: 4px; }

/* ─────────────────────────── Shapes ─────────────────────────── */
.app-btn--pill    { border-radius: 9999px; }
.app-btn--rounded { /* keeps size-driven radius */ }
.app-btn--circle  {
    padding: 0;
    border-radius: 50%;
}
.app-btn--circle.app-btn--large  { width: 50px;  height: 50px; }
.app-btn--circle.app-btn--medium { width: 40px;  height: 40px; }
.app-btn--circle.app-btn--small  { width: 32px;  height: 32px; }
.app-btn--circle.app-btn--mini   { width: 26px;  height: 26px; }

/* ─────────────────────────── Icon sizing ─────────────────────────── */
.app-btn__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.app-btn--large  .app-btn__icon { width: 18px; height: 18px; font-size: 18px; }
.app-btn--medium .app-btn__icon { width: 16px; height: 16px; font-size: 16px; }
.app-btn--small  .app-btn__icon { width: 14px; height: 14px; font-size: 14px; }
.app-btn--mini   .app-btn__icon { width: 12px; height: 12px; font-size: 12px; }

.app-btn__icon svg,
.app-btn__icon img {
    width: 100%;
    height: 100%;
    display: block;
}

/* ─────────────────────────── Spinner ─────────────────────────── */
.app-btn__spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: btn-spin 0.7s linear infinite;
    opacity: 0.7;
}
@keyframes btn-spin {
    to { transform: rotate(360deg); }
}

/* ─────────────────────────── Disabled ─────────────────────────── */
.app-btn--disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
}


/* ══════════════════════════════════════════════════════════════════
   FILLED
══════════════════════════════════════════════════════════════════ */
/* Filled / Blue */
.app-btn--filled.app-btn--blue {
    background: #007aff;
    color: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 122, 255, 0.3), 0 0 0 0.5px rgba(0,0,0,0.04) inset;
}
.app-btn--filled.app-btn--blue:hover:not(.app-btn--disabled) {
    background: #0071eb;
}

/* Filled / Red */
.app-btn--filled.app-btn--red {
    background: #ff3b30;
    color: #ffffff;
    box-shadow: 0 1px 4px rgba(255, 59, 48, 0.3), 0 0 0 0.5px rgba(0,0,0,0.04) inset;
}
.app-btn--filled.app-btn--red:hover:not(.app-btn--disabled) {
    background: #f02d22;
}

/* Filled / Default (system) */
.app-btn--filled.app-btn--default {
    background: #1d1d1f;
    color: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}


/* ══════════════════════════════════════════════════════════════════
   TINTED  (iOS 26 liquid glass)
══════════════════════════════════════════════════════════════════ */
.app-btn--tinted {
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
}

/* Tinted / Blue */
.app-btn--tinted.app-btn--blue {
    background: rgba(0, 122, 255, 0.14);
    color: #007aff;
    box-shadow: 0 0 0 0.5px rgba(0, 122, 255, 0.25) inset,
                0 1px 0 rgba(255,255,255,0.55) inset;
}
.app-btn--tinted.app-btn--blue:hover:not(.app-btn--disabled) {
    background: rgba(0, 122, 255, 0.2);
}

/* Tinted / Red */
.app-btn--tinted.app-btn--red {
    background: rgba(255, 59, 48, 0.12);
    color: #ff3b30;
    box-shadow: 0 0 0 0.5px rgba(255, 59, 48, 0.22) inset,
                0 1px 0 rgba(255,255,255,0.5) inset;
}
.app-btn--tinted.app-btn--red:hover:not(.app-btn--disabled) {
    background: rgba(255, 59, 48, 0.18);
}

/* Tinted / Default */
.app-btn--tinted.app-btn--default {
    background: rgba(120, 120, 128, 0.12);
    color: #1d1d1f;
    box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.08) inset,
                0 1px 0 rgba(255,255,255,0.6) inset;
}
.app-btn--tinted.app-btn--default:hover:not(.app-btn--disabled) {
    background: rgba(120, 120, 128, 0.18);
}


/* ══════════════════════════════════════════════════════════════════
   GRAY
══════════════════════════════════════════════════════════════════ */
.app-btn--gray.app-btn--blue,
.app-btn--gray.app-btn--red,
.app-btn--gray.app-btn--default {
    background: rgba(120, 120, 128, 0.16);
    color: #1d1d1f;
    box-shadow: 0 0 0 0.5px rgba(0,0,0,0.06) inset;
}
.app-btn--gray:hover:not(.app-btn--disabled) {
    background: rgba(120, 120, 128, 0.22);
}
/* Gray preserves color hint for icon */
.app-btn--gray.app-btn--blue .app-btn__icon { color: #007aff; }
.app-btn--gray.app-btn--red  .app-btn__icon { color: #ff3b30; }


/* ══════════════════════════════════════════════════════════════════
   PLAIN
══════════════════════════════════════════════════════════════════ */
.app-btn--plain {
    background: transparent;
    box-shadow: none;
    padding-left: 4px;
    padding-right: 4px;
}
.app-btn--plain.app-btn--blue    { color: #007aff; }
.app-btn--plain.app-btn--red     { color: #ff3b30; }
.app-btn--plain.app-btn--default { color: #1d1d1f; }
.app-btn--plain:hover:not(.app-btn--disabled) {
    opacity: 0.7;
}


/* ══════════════════════════════════════════════════════════════════
   DARK MODE
══════════════════════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {

    /* Filled */
    .app-btn--filled.app-btn--blue    { background: #0a84ff; box-shadow: 0 1px 4px rgba(10,132,255,0.35); }
    .app-btn--filled.app-btn--blue:hover:not(.app-btn--disabled) { background: #1a90ff; }

    .app-btn--filled.app-btn--red     { background: #ff453a; box-shadow: 0 1px 4px rgba(255,69,58,0.35); }
    .app-btn--filled.app-btn--red:hover:not(.app-btn--disabled) { background: #ff5147; }

    .app-btn--filled.app-btn--default { background: #f5f5f7; color: #1d1d1f; }

    /* Tinted */
    .app-btn--tinted.app-btn--blue {
        background: rgba(10, 132, 255, 0.22);
        color: #0a84ff;
        box-shadow: 0 0 0 0.5px rgba(10,132,255,0.3) inset,
                    0 1px 0 rgba(255,255,255,0.08) inset;
    }
    .app-btn--tinted.app-btn--blue:hover:not(.app-btn--disabled) { background: rgba(10,132,255,0.3); }

    .app-btn--tinted.app-btn--red {
        background: rgba(255, 69, 58, 0.2);
        color: #ff453a;
        box-shadow: 0 0 0 0.5px rgba(255,69,58,0.28) inset,
                    0 1px 0 rgba(255,255,255,0.06) inset;
    }
    .app-btn--tinted.app-btn--red:hover:not(.app-btn--disabled) { background: rgba(255,69,58,0.28); }

    .app-btn--tinted.app-btn--default {
        background: rgba(120, 120, 128, 0.22);
        color: #f5f5f7;
        box-shadow: 0 0 0 0.5px rgba(255,255,255,0.08) inset,
                    0 1px 0 rgba(255,255,255,0.05) inset;
    }
    .app-btn--tinted.app-btn--default:hover:not(.app-btn--disabled) { background: rgba(120,120,128,0.3); }

    /* Gray */
    .app-btn--gray.app-btn--blue,
    .app-btn--gray.app-btn--red,
    .app-btn--gray.app-btn--default {
        background: rgba(120, 120, 128, 0.28);
        color: #f5f5f7;
        box-shadow: 0 0 0 0.5px rgba(255,255,255,0.06) inset;
    }
    .app-btn--gray:hover:not(.app-btn--disabled) { background: rgba(120,120,128,0.36); }
    .app-btn--gray.app-btn--blue .app-btn__icon { color: #0a84ff; }
    .app-btn--gray.app-btn--red  .app-btn__icon { color: #ff453a; }

    /* Plain */
    .app-btn--plain.app-btn--blue    { color: #0a84ff; }
    .app-btn--plain.app-btn--red     { color: #ff453a; }
    .app-btn--plain.app-btn--default { color: #f5f5f7; }
}
</style>
