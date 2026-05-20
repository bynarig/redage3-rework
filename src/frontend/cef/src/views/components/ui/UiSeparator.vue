<script setup lang="ts">
import { computed } from 'vue'

export type UiSeparatorColor = 'primary' | 'neutral'
export type UiSeparatorType = 'solid' | 'dashed' | 'dotted'
export type UiSeparatorSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type UiSeparatorOrientation = 'horizontal' | 'vertical'

const props = withDefaults(defineProps<{
    label?: string
    color?: UiSeparatorColor
    type?: UiSeparatorType
    size?: UiSeparatorSize
    orientation?: UiSeparatorOrientation
    icon?: string
    decorative?: boolean
    class?: string
}>(), {
    color: 'neutral',
    type: 'solid',
    size: 'xs',
    orientation: 'horizontal',
    decorative: false,
})

defineOptions({ inheritAttrs: false })

const classList = computed(() => [
    'ui-sep',
    `ui-sep--c-${props.color}`,
    `ui-sep--t-${props.type}`,
    `ui-sep--s-${props.size}`,
    `ui-sep--o-${props.orientation}`,
    { 'ui-sep--with-label': !!(props.label || props.icon) },
    props.class,
])
</script>

<template>
    <div :class="classList" :role="decorative ? 'none' : 'separator'" v-bind="$attrs">
        <span class="ui-sep__line" />
        <span v-if="label || icon || $slots.default" class="ui-sep__label">
            <slot>
                <span v-if="icon" class="ui-sep__icon">{{ icon }}</span>
                <span v-if="label">{{ label }}</span>
            </slot>
        </span>
        <span v-if="label || icon || $slots.default" class="ui-sep__line" />
    </div>
</template>

<style lang="scss" scoped>
.ui-sep {
    --_c: var(--glass-border);
    --_thick: 1px;

    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    color: var(--glass-text-muted);

    &--c-primary { --_c: var(--glass-accent); }

    &--s-xs { --_thick: 1px; }
    &--s-sm { --_thick: 2px; }
    &--s-md { --_thick: 3px; }
    &--s-lg { --_thick: 4px; }
    &--s-xl { --_thick: 6px; }

    &__line {
        flex: 1;
        height: var(--_thick);
        background: var(--_c);
        border-radius: 999px;
    }

    &--t-dashed .ui-sep__line {
        background: transparent;
        border-top: var(--_thick) dashed var(--_c);
        height: 0;
    }

    &--t-dotted .ui-sep__line {
        background: transparent;
        border-top: var(--_thick) dotted var(--_c);
        height: 0;
    }

    &--o-vertical {
        flex-direction: column;
        width: auto;
        height: 100%;
        align-self: stretch;

        .ui-sep__line {
            width: var(--_thick);
            height: auto;
            flex: 1;
        }
    }

    &__label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-family: var(--ui-font-mono);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--glass-text-muted);
        white-space: nowrap;
    }

    &__icon {
        font-size: 1em;
    }

    &--with-label {
        .ui-sep__line { flex: 1; }
    }
}
</style>
