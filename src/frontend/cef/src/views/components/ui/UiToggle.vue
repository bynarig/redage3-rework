<script setup lang="ts">
import { computed } from 'vue'

export type UiToggleColor = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
export type UiToggleSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<boolean>({ default: false })

const props = withDefaults(defineProps<{
    label?: string
    description?: string
    disabled?: boolean
    required?: boolean
    color?: UiToggleColor
    size?: UiToggleSize
    class?: string
}>(), {
    color: 'primary',
    size: 'md',
    disabled: false,
    required: false,
})

defineOptions({ inheritAttrs: false })

const wrapClass = computed(() => [
    'ui-toggle',
    `ui-toggle--c-${props.color}`,
    `ui-toggle--s-${props.size}`,
    { 'ui-toggle--on': model.value, 'ui-toggle--disabled': props.disabled },
    props.class,
])

function toggle() {
    if (props.disabled) return
    model.value = !model.value
}
</script>

<template>
    <label :class="wrapClass" v-bind="$attrs">
        <button
            type="button"
            class="ui-toggle__track"
            role="switch"
            :aria-checked="model"
            :disabled="disabled"
            @click="toggle"
        >
            <span class="ui-toggle__thumb" aria-hidden="true" />
        </button>
        <span v-if="label || description || $slots.label || $slots.description" class="ui-toggle__text">
            <slot name="label"><span v-if="label" class="ui-toggle__label">{{ label }}</span></slot>
            <slot name="description"><span v-if="description" class="ui-toggle__desc">{{ description }}</span></slot>
        </span>
    </label>
</template>

<style lang="scss" scoped>
.ui-toggle {
    --_c: var(--glass-accent);
    --_w: 44px;
    --_h: 26px;
    --_pad: 3px;

    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    color: var(--glass-text);

    &--c-primary   { --_c: var(--glass-accent); }
    &--c-secondary { --_c: var(--glass-info); }
    &--c-success   { --_c: var(--glass-success); }
    &--c-warning   { --_c: var(--glass-warning); }
    &--c-error     { --_c: var(--glass-danger); }
    &--c-neutral   { --_c: var(--glass-text); }

    &--s-xs { --_w: 32px; --_h: 18px; --_pad: 2px; font-size: 12px; }
    &--s-sm { --_w: 38px; --_h: 22px; --_pad: 2.5px; font-size: 13px; }
    &--s-md { --_w: 44px; --_h: 26px; --_pad: 3px; font-size: 14px; }
    &--s-lg { --_w: 52px; --_h: 30px; --_pad: 3px; font-size: 15px; }
    &--s-xl { --_w: 60px; --_h: 34px; --_pad: 4px; font-size: 16px; }

    &--disabled { opacity: 0.5; cursor: not-allowed; }

    &__track {
        all: unset;
        position: relative;
        width: var(--_w);
        height: var(--_h);
        flex: 0 0 auto;
        border-radius: var(--glass-radius-pill);
        background: var(--glass-recessed-bg);
        backdrop-filter: blur(12px) saturate(160%);
        -webkit-backdrop-filter: blur(12px) saturate(160%);
        border: 1px solid var(--glass-border-soft);
        cursor: inherit;
        transition: background 240ms ease, border-color 240ms ease, box-shadow 240ms ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06) inset;

        &:focus-visible {
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--_c) 30%, transparent),
                        0 2px 4px rgba(0, 0, 0, 0.06) inset;
        }
    }

    &__thumb {
        position: absolute;
        top: var(--_pad);
        left: var(--_pad);
        width: calc(var(--_h) - var(--_pad) * 2);
        height: calc(var(--_h) - var(--_pad) * 2);
        border-radius: 50%;
        background: linear-gradient(180deg, #ffffff 0%, #e6e9f0 100%);
        box-shadow: 0 2px 6px rgba(15, 23, 42, 0.24), 0 1px 0 rgba(255, 255, 255, 0.85) inset;
        transition: transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), background 240ms ease;
    }

    &--on .ui-toggle__track {
        background: linear-gradient(180deg,
            color-mix(in srgb, var(--_c) 95%, white 5%),
            var(--_c));
        border-color: color-mix(in srgb, var(--_c) 60%, transparent);
        box-shadow: 0 6px 14px color-mix(in srgb, var(--_c) 30%, transparent),
                    0 1px 0 rgba(255, 255, 255, 0.40) inset;
    }

    &--on .ui-toggle__thumb {
        transform: translateX(calc(var(--_w) - var(--_h)));
    }

    &__text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        line-height: 1.4;
    }

    &__label { font-weight: 540; }
    &__desc { font-size: 0.85em; color: var(--glass-text-muted); }
}
</style>
