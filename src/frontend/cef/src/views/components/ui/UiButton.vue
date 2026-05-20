<script setup lang="ts">
import { computed } from 'vue'

export type UiButtonColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiButtonVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
export type UiButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
    color?: UiButtonColor
    variant?: UiButtonVariant
    size?: UiButtonSize
    label?: string
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    loading?: boolean
    loadingIcon?: string
    disabled?: boolean
    block?: boolean
    square?: boolean
    type?: 'button' | 'submit' | 'reset'
    class?: string
}>(), {
    color: 'primary',
    variant: 'solid',
    size: 'md',
    loading: false,
    disabled: false,
    block: false,
    square: false,
    type: 'button',
})

defineEmits<{ (e: 'click', event: MouseEvent): void }>()
defineOptions({ inheritAttrs: false })

const classList = computed(() => [
    'ui-btn',
    `ui-btn--c-${props.color}`,
    `ui-btn--v-${props.variant}`,
    `ui-btn--s-${props.size}`,
    {
        'ui-btn--block': props.block,
        'ui-btn--square': props.square,
        'ui-btn--loading': props.loading,
    },
    props.class,
])
</script>

<template>
    <button
        :type="type"
        :disabled="disabled || loading"
        :class="classList"
        v-bind="$attrs"
        @click="(e) => $emit('click', e)"
    >
        <span class="ui-btn__inner">
            <span v-if="loading" class="ui-btn__spinner" aria-hidden="true" />
            <slot name="leading">
                <span v-if="leadingIcon || icon" class="ui-btn__icon">{{ leadingIcon ?? icon }}</span>
            </slot>
            <span v-if="$slots.default || label" class="ui-btn__label">
                <slot>{{ label }}</slot>
            </span>
            <slot name="trailing">
                <span v-if="trailingIcon" class="ui-btn__icon">{{ trailingIcon }}</span>
            </slot>
        </span>
    </button>
</template>

<style lang="scss" scoped>
.ui-btn {
    --_c: var(--glass-accent);
    --_c-soft: var(--glass-accent-soft);

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0 18px;
    height: 38px;
    font-family: var(--ui-font),serif;
    font-size: 14px;
    font-weight: 540;
    letter-spacing: -0.005em;
    color: var(--glass-text);
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    background: var(--glass-pane-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    box-shadow: var(--glass-shadow-sm);
    cursor: pointer;
    overflow: hidden;
    transition: transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1),
                background 220ms ease,
                box-shadow 220ms ease,
                border-color 220ms ease;
    isolation: isolate;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background: linear-gradient(180deg, var(--glass-rim-top) 0%, transparent 38%);
        opacity: 0.7;
        mix-blend-mode: overlay;
    }

    &:hover:not(:disabled) {
        //background: var(--glass-pane-bg-hover);
        transform: translateY(-1px) scale(1.05);
        box-shadow: var(--glass-shadow);
    }

    &:active:not(:disabled) {
        transform: translateY(0) scale(0.985);
    }

    &:focus-visible {
        outline: none;
        box-shadow: var(--glass-shadow-sm), var(--glass-ring);
    }

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    &__inner {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 8px;
    }

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.1em;
        height: 1.1em;
        font-size: 1em;
    }

    &__spinner {
        width: 13px;
        height: 13px;
        border-radius: 50%;
        border: 1.6px solid currentColor;
        border-right-color: transparent;
        animation: ui-btn-spin 0.7s linear infinite;
    }

    // ─── Color tint ──────────────────────────────────────────────────────
    &--c-primary   { --_c: var(--glass-accent);  --_c-soft: var(--glass-accent-soft); }
    &--c-secondary { --_c: var(--glass-info);    --_c-soft: var(--glass-info-soft); }
    &--c-success   { --_c: var(--glass-success); --_c-soft: var(--glass-success-soft); }
    &--c-info      { --_c: var(--glass-info);    --_c-soft: var(--glass-info-soft); }
    &--c-warning   { --_c: var(--glass-warning); --_c-soft: var(--glass-warning-soft); }
    &--c-error     { --_c: var(--glass-danger);  --_c-soft: var(--glass-danger-soft); }
    &--c-neutral   { --_c: var(--glass-text);    --_c-soft: var(--glass-recessed-bg); }

    // ─── Variants ────────────────────────────────────────────────────────
    &--v-solid {
        background: linear-gradient(180deg,
            color-mix(in srgb, var(--_c) 92%, white 8%),
            var(--_c));
        color: var(--glass-text-on-tint);
        border-color: color-mix(in srgb, var(--_c) 85%, black 15%);
        box-shadow: 0 8px 22px color-mix(in srgb, var(--_c) 32%, transparent),
                    0 1px 0 rgba(255, 255, 255, 0.35) inset;

        &::before {
            background: linear-gradient(180deg, rgba(255,255,255,0.42) 0%, transparent 50%);
            opacity: 1;
        }

        &:hover:not(:disabled) {
            box-shadow: 0 12px 28px color-mix(in srgb, var(--_c) 42%, transparent),
                        0 1px 0 rgba(255, 255, 255, 0.40) inset;
        }
    }

    &--v-outline {
        background: transparent;
        border-color: var(--_c);
        color: var(--_c);
        box-shadow: 0 0 0 0.5px var(--_c) inset;

        &::before { display: none; }

        &:hover:not(:disabled) {
            background: var(--_c-soft);
        }
    }

    &--v-soft {
        background: var(--_c-soft);
        border-color: color-mix(in srgb, var(--_c) 30%, transparent);
        color: var(--_c);
    }

    &--v-subtle {
        background: color-mix(in srgb, var(--_c) 6%, var(--glass-pane-bg));
        border-color: color-mix(in srgb, var(--_c) 22%, var(--glass-border));
        color: var(--_c);
    }

    &--v-ghost {
        background: transparent;
        border-color: transparent;
        color: var(--_c);
        box-shadow: none;
        backdrop-filter: none;

        &::before { display: none; }

        &:hover:not(:disabled) {
            background: var(--_c-soft);
        }
    }

    &--v-link {
        background: transparent;
        border-color: transparent;
        box-shadow: none;
        backdrop-filter: none;
        padding: 0;
        height: auto;
        color: var(--_c);
        text-decoration: underline;
        text-decoration-thickness: 1px;
        text-underline-offset: 3px;

        &::before { display: none; }

        &:hover:not(:disabled) {
            text-decoration-thickness: 2px;
        }
    }

    // ─── Sizes ───────────────────────────────────────────────────────────
    &--s-xs { height: 26px; padding: 0 10px; font-size: 12px; border-radius: var(--glass-radius-sm); gap: 5px; }
    &--s-sm { height: 32px; padding: 0 14px; font-size: 13px; border-radius: var(--glass-radius-sm); gap: 6px; }
    &--s-md { height: 38px; padding: 0 18px; font-size: 14px; }
    &--s-lg { height: 46px; padding: 0 22px; font-size: 15px; border-radius: var(--glass-radius-lg); }
    &--s-xl { height: 54px; padding: 0 28px; font-size: 16px; border-radius: var(--glass-radius-lg); }

    &--block { width: 100%; }

    &--square {
        padding: 0;
        aspect-ratio: 1;
        width: auto;

        &.ui-btn--s-xs { width: 26px; }
        &.ui-btn--s-sm { width: 32px; }
        &.ui-btn--s-md { width: 38px; }
        &.ui-btn--s-lg { width: 46px; }
        &.ui-btn--s-xl { width: 54px; }
    }
}

@keyframes ui-btn-spin {
    to { transform: rotate(360deg); }
}
</style>
