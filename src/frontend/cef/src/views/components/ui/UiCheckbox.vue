<script setup lang="ts">
import { computed } from 'vue'

export type UiCheckboxColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiCheckboxSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<boolean | 'indeterminate'>({ default: false })

const props = withDefaults(defineProps<{
    label?: string
    description?: string
    indeterminate?: boolean
    required?: boolean
    disabled?: boolean
    color?: UiCheckboxColor
    size?: UiCheckboxSize
    class?: string
}>(), {
    color: 'primary',
    size: 'md',
    disabled: false,
    required: false,
    indeterminate: false,
})

defineOptions({ inheritAttrs: false })

const wrapClass = computed(() => [
    'ui-checkbox',
    `ui-checkbox--c-${props.color}`,
    `ui-checkbox--s-${props.size}`,
    {
        'ui-checkbox--checked': model.value === true,
        'ui-checkbox--indeterminate': props.indeterminate || model.value === 'indeterminate',
        'ui-checkbox--disabled': props.disabled,
    },
    props.class,
])

function toggle() {
    if (props.disabled) return
    model.value = model.value === true ? false : true
}
</script>

<template>
    <label :class="wrapClass" v-bind="$attrs">
        <input
            type="checkbox"
            class="ui-checkbox__native"
            :checked="model === true"
            :disabled="disabled"
            :required="required"
            @change="toggle"
        />
        <span class="ui-checkbox__box" aria-hidden="true">
            <svg v-if="indeterminate || model === 'indeterminate'" viewBox="0 0 16 16" class="ui-checkbox__mark">
                <path d="M4 8h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <svg v-else viewBox="0 0 16 16" class="ui-checkbox__mark">
                <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
            </svg>
        </span>
        <span v-if="label || description || $slots.label || $slots.description" class="ui-checkbox__text">
            <slot name="label"><span v-if="label" class="ui-checkbox__label">{{ label }}</span></slot>
            <slot name="description"><span v-if="description" class="ui-checkbox__desc">{{ description }}</span></slot>
        </span>
    </label>
</template>

<style lang="scss" scoped>
.ui-checkbox {
    --_c: var(--glass-accent);
    --_box: 18px;

    display: inline-flex;
    align-items: flex-start;
    gap: 10px;
    cursor: pointer;
    color: var(--glass-text);
    user-select: none;

    &--c-primary   { --_c: var(--glass-accent); }
    &--c-secondary { --_c: var(--glass-info); }
    &--c-success   { --_c: var(--glass-success); }
    &--c-info      { --_c: var(--glass-info); }
    &--c-warning   { --_c: var(--glass-warning); }
    &--c-error     { --_c: var(--glass-danger); }
    &--c-neutral   { --_c: var(--glass-text); }

    &--s-xs { --_box: 14px; font-size: 12px; }
    &--s-sm { --_box: 16px; font-size: 13px; }
    &--s-md { --_box: 18px; font-size: 14px; }
    &--s-lg { --_box: 22px; font-size: 15px; }
    &--s-xl { --_box: 26px; font-size: 16px; }

    &--disabled { opacity: 0.5; cursor: not-allowed; }

    &__native {
        position: absolute;
        opacity: 0;
        pointer-events: none;
        width: 0;
        height: 0;
    }

    &__box {
        position: relative;
        width: var(--_box);
        height: var(--_box);
        flex: 0 0 auto;
        margin-top: 1px;
        border-radius: calc(var(--_box) * 0.28);
        background: var(--glass-pane-bg);
        backdrop-filter: blur(12px) saturate(160%);
        -webkit-backdrop-filter: blur(12px) saturate(160%);
        border: 1px solid var(--glass-border);
        box-shadow: 0 1px 0 var(--glass-rim-top) inset, 0 2px 6px rgba(15, 23, 42, 0.08);
        transition: background 180ms ease, border-color 180ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--glass-text-on-tint);

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            background: linear-gradient(180deg, var(--glass-rim-top) 0%, transparent 50%);
            opacity: 0.6;
            pointer-events: none;
            mix-blend-mode: overlay;
        }
    }

    &__mark {
        position: relative;
        z-index: 1;
        width: 78%;
        height: 78%;
        opacity: 0;
        transform: scale(0.6);
        transition: opacity 180ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    &--checked .ui-checkbox__box,
    &--indeterminate .ui-checkbox__box {
        background: var(--_c);
        border-color: color-mix(in srgb, var(--_c) 85%, black 15%);
        box-shadow: 0 6px 16px color-mix(in srgb, var(--_c) 35%, transparent), 0 1px 0 rgba(255,255,255,0.32) inset;
    }

    &--checked .ui-checkbox__mark,
    &--indeterminate .ui-checkbox__mark {
        opacity: 1;
        transform: scale(1);
    }

    &:hover:not(.ui-checkbox--disabled) .ui-checkbox__box {
        border-color: var(--_c);
    }

    &__native:focus-visible + &__box {
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--_c) 30%, transparent);
    }

    &__text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        line-height: 1.4;
    }

    &__label {
        font-weight: 540;
        letter-spacing: -0.003em;
    }

    &__desc {
        font-size: 0.85em;
        color: var(--glass-text-muted);
    }
}
</style>
