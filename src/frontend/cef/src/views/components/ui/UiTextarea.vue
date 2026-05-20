<script setup lang="ts">
import { computed } from 'vue'

export type UiTextareaColor = 'primary' | 'error' | 'neutral'
export type UiTextareaVariant = 'outline' | 'soft' | 'subtle' | 'none'
export type UiTextareaSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const model = defineModel<string | undefined>({ default: undefined })

const props = withDefaults(defineProps<{
    placeholder?: string
    rows?: number
    color?: UiTextareaColor
    variant?: UiTextareaVariant
    size?: UiTextareaSize
    loading?: boolean
    highlight?: boolean
    disabled?: boolean
    readonly?: boolean
    autofocus?: boolean
    autoresize?: boolean
    maxrows?: number
    class?: string
}>(), {
    rows: 3,
    color: 'primary',
    variant: 'outline',
    size: 'md',
    disabled: false,
    readonly: false,
    autoresize: false,
})

defineOptions({ inheritAttrs: false })

const wrapClass = computed(() => [
    'ui-textarea',
    `ui-textarea--c-${props.color}`,
    `ui-textarea--v-${props.variant}`,
    `ui-textarea--s-${props.size}`,
    { 'ui-textarea--disabled': props.disabled, 'ui-textarea--highlight': props.highlight },
    props.class,
])
</script>

<template>
    <label :class="wrapClass" v-bind="$attrs">
        <textarea
            v-model="model"
            :placeholder="placeholder"
            :rows="rows"
            :disabled="disabled"
            :readonly="readonly"
            :autofocus="autofocus"
            class="ui-textarea__field"
        />
    </label>
</template>

<style lang="scss" scoped>
.ui-textarea {
    --_c: var(--glass-accent);
    --_c-soft: var(--glass-accent-soft);

    position: relative;
    display: flex;
    padding: 10px 14px;
    width: 100%;
    max-width: 320px;
    background: var(--glass-pane-bg);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    border: 1px solid var(--glass-border);
    border-radius: var(--glass-radius);
    color: var(--glass-text);
    cursor: text;
    transition: border-color 200ms ease, box-shadow 200ms ease;
    isolation: isolate;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background: linear-gradient(180deg, var(--glass-rim-top) 0%, transparent 22%);
        opacity: 0.5;
        mix-blend-mode: overlay;
    }

    &:focus-within {
        border-color: var(--_c);
        box-shadow: var(--glass-shadow-sm), 0 0 0 3px color-mix(in srgb, var(--_c) 24%, transparent);
    }

    &--c-error   { --_c: var(--glass-danger);  --_c-soft: var(--glass-danger-soft); }
    &--c-neutral { --_c: var(--glass-text);    --_c-soft: var(--glass-recessed-bg); }

    &--v-soft    { background: var(--_c-soft); border-color: transparent; }
    &--v-subtle  { background: var(--glass-recessed-bg); border-color: var(--glass-border-soft); }
    &--v-none    { background: transparent; border-color: transparent; backdrop-filter: none; &::before { display: none; } }

    &--highlight { box-shadow: 0 0 0 3px var(--_c-soft); border-color: var(--_c); }

    &--disabled  { opacity: 0.5; cursor: not-allowed; }

    &--s-xs .ui-textarea__field { font-size: 12px; }
    &--s-sm .ui-textarea__field { font-size: 13px; }
    &--s-md .ui-textarea__field { font-size: 14px; }
    &--s-lg .ui-textarea__field { font-size: 15px; }
    &--s-xl .ui-textarea__field { font-size: 16px; }

    &__field {
        position: relative;
        z-index: 1;
        flex: 1;
        width: 100%;
        min-width: 0;
        border: 0;
        background: transparent;
        outline: none;
        resize: vertical;
        font-family: var(--ui-font);
        font-size: 14px;
        color: inherit;
        line-height: 1.55;

        &::placeholder { color: var(--glass-text-subtle); }
    }
}
</style>
