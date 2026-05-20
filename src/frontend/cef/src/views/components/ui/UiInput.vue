<script setup lang="ts">
import { computed } from 'vue'

export type UiInputColor = 'primary' | 'error' | 'neutral'
export type UiInputVariant = 'outline' | 'soft' | 'subtle' | 'none'
export type UiInputSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<string | number | undefined>({ default: '' })

const props = withDefaults(defineProps<{
    placeholder?: string
    type?: string
    color?: UiInputColor
    variant?: UiInputVariant
    size?: UiInputSize
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    loading?: boolean
    highlight?: boolean
    disabled?: boolean
    readonly?: boolean
    autocomplete?: string
    autofocus?: boolean
    clearable?: boolean
    class?: string
}>(), {
    type: 'text',
    color: 'primary',
    variant: 'outline',
    size: 'md',
    loading: false,
    disabled: false,
    readonly: false,
})

defineOptions({ inheritAttrs: false })

const wrapClass = computed(() => [
    'ui-input',
    `ui-input--c-${props.color}`,
    `ui-input--v-${props.variant}`,
    `ui-input--s-${props.size}`,
    {
        'ui-input--disabled': props.disabled,
        'ui-input--highlight': props.highlight,
        'ui-input--has-leading': !!(props.leadingIcon || props.icon || !!props.loading),
        'ui-input--has-trailing': !!(props.trailingIcon || props.clearable),
    },
    props.class,
])

function clear() {
    model.value = ''
}
</script>

<template>
    <label :class="wrapClass" v-bind="$attrs">
        <span v-if="$slots.leading || leadingIcon || icon || loading" class="ui-input__addon ui-input__addon--leading">
            <slot name="leading">
                <span v-if="loading" class="ui-input__spinner" aria-hidden="true" />
                <span v-else class="ui-input__icon">{{ leadingIcon ?? icon }}</span>
            </slot>
        </span>

        <input
            v-model="model"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :autocomplete="autocomplete"
            :autofocus="autofocus"
            class="ui-input__field"
        />

        <span v-if="$slots.trailing || trailingIcon || (clearable && model)" class="ui-input__addon ui-input__addon--trailing">
            <slot name="trailing">
                <button
                    v-if="clearable && model"
                    type="button"
                    class="ui-input__clear"
                    aria-label="Clear"
                    @click="clear"
                >×</button>
                <span v-else class="ui-input__icon">{{ trailingIcon }}</span>
            </slot>
        </span>
    </label>
</template>

<style lang="scss" scoped>
.ui-input {
    --_c: var(--glass-accent);
    --_c-soft: var(--glass-accent-soft);

    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    height: 40px;
    width: 100%;
    max-width: 320px;
    background: var(--glass-pane-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    color: var(--glass-text);
    cursor: text;
    transition: border-color 200ms ease, box-shadow 200ms ease, background 220ms ease;
    isolation: isolate;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background: linear-gradient(180deg, var(--glass-rim-top) 0%, transparent 36%);
        opacity: 0.55;
        mix-blend-mode: overlay;
    }

    &:hover:not(.ui-input--disabled) {
        background: var(--glass-pane-bg-hover);
    }

    &:focus-within {
        border-color: var(--_c);
        box-shadow: var(--glass-shadow-sm), 0 0 0 3px color-mix(in srgb, var(--_c) 24%, transparent);
    }

    &--c-error    { --_c: var(--glass-danger);  --_c-soft: var(--glass-danger-soft); }
    &--c-neutral  { --_c: var(--glass-text);    --_c-soft: var(--glass-recessed-bg); }
    &--c-primary  { --_c: var(--glass-accent);  --_c-soft: var(--glass-accent-soft); }

    &--v-soft     { background: var(--_c-soft); border-color: transparent; }
    &--v-subtle   { background: var(--glass-recessed-bg); border-color: var(--glass-border-soft); }
    &--v-none     { background: transparent; border-color: transparent; box-shadow: none; backdrop-filter: none; &::before { display: none; } }

    &--highlight  { box-shadow: 0 0 0 3px var(--_c-soft); border-color: var(--_c); }

    &--disabled   { opacity: 0.5; cursor: not-allowed; }

    &--s-xs { height: 28px; padding: 0 10px; font-size: 12px; border-radius: var(--glass-radius-sm); }
    &--s-sm { height: 34px; padding: 0 12px; font-size: 13px; border-radius: var(--glass-radius-sm); }
    &--s-md { height: 40px; }
    &--s-lg { height: 46px; font-size: 15px; }
    &--s-xl { height: 54px; font-size: 16px; padding: 0 18px; border-radius: var(--glass-radius-lg); }

    &__field {
        position: relative;
        z-index: 1;
        flex: 1;
        width: 100%;
        min-width: 0;
        border: 0;
        background: transparent;
        outline: none;
        font: inherit;
        font-family: var(--ui-font);
        color: inherit;
        letter-spacing: -0.003em;

        &::placeholder {
            color: var(--glass-text-subtle);
        }

        &:disabled {
            cursor: not-allowed;
        }
    }

    &__addon {
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--glass-text-muted);
        font-size: 0.95em;
        flex: 0 0 auto;
    }

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.1em;
        height: 1.1em;
    }

    &__clear {
        all: unset;
        cursor: pointer;
        width: 18px;
        height: 18px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: var(--glass-recessed-bg);
        color: var(--glass-text);
        font-size: 14px;
        line-height: 1;

        &:hover { background: color-mix(in srgb, var(--glass-text) 14%, transparent); }
    }

    &__spinner {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 1.5px solid currentColor;
        border-right-color: transparent;
        animation: ui-input-spin 0.7s linear infinite;
    }
}

@keyframes ui-input-spin {
    to { transform: rotate(360deg); }
}
</style>
