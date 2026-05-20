<script setup lang="ts">
import { computed } from 'vue'

export type UiBadgeColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiBadgeVariant = 'solid' | 'outline' | 'soft' | 'subtle'
export type UiBadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
    label?: string
    color?: UiBadgeColor
    variant?: UiBadgeVariant
    size?: UiBadgeSize
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    class?: string
}>(), {
    color: 'primary',
    variant: 'solid',
    size: 'md',
})

defineOptions({ inheritAttrs: false })

const classList = computed(() => [
    'ui-badge',
    `ui-badge--c-${props.color}`,
    `ui-badge--v-${props.variant}`,
    `ui-badge--s-${props.size}`,
    props.class,
])
</script>

<template>
    <span :class="classList" v-bind="$attrs">
        <span v-if="leadingIcon || icon" class="ui-badge__icon">{{ leadingIcon ?? icon }}</span>
        <span class="ui-badge__label"><slot>{{ label }}</slot></span>
        <span v-if="trailingIcon" class="ui-badge__icon">{{ trailingIcon }}</span>
    </span>
</template>

<style lang="scss" scoped>
.ui-badge {
    --_c: var(--glass-accent);
    --_c-soft: var(--glass-accent-soft);

    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0 8px;
    height: 22px;
    font-family: var(--ui-font-mono);
    font-size: 11px;
    font-weight: 540;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    border-radius: var(--glass-radius-pill);
    border: 1px solid transparent;
    color: var(--glass-text-on-tint);
    background: var(--_c);
    box-shadow: 0 4px 12px color-mix(in srgb, var(--_c) 28%, transparent);
    line-height: 1;
    white-space: nowrap;

    &--c-primary   { --_c: var(--glass-accent);  --_c-soft: var(--glass-accent-soft); }
    &--c-secondary { --_c: var(--glass-info);    --_c-soft: var(--glass-info-soft); }
    &--c-success   { --_c: var(--glass-success); --_c-soft: var(--glass-success-soft); }
    &--c-info      { --_c: var(--glass-info);    --_c-soft: var(--glass-info-soft); }
    &--c-warning   { --_c: var(--glass-warning); --_c-soft: var(--glass-warning-soft); }
    &--c-error     { --_c: var(--glass-danger);  --_c-soft: var(--glass-danger-soft); }
    &--c-neutral   { --_c: var(--glass-text);    --_c-soft: var(--glass-recessed-bg); }

    &--v-outline {
        background: transparent;
        border-color: var(--_c);
        color: var(--_c);
        box-shadow: none;
    }

    &--v-soft {
        background: var(--_c-soft);
        color: var(--_c);
        border-color: color-mix(in srgb, var(--_c) 22%, transparent);
        box-shadow: none;
    }

    &--v-subtle {
        background: var(--glass-recessed-bg);
        color: var(--_c);
        border-color: var(--glass-border-soft);
        box-shadow: none;
    }

    &--s-xs { height: 18px; padding: 0 6px; font-size: 9.5px; }
    &--s-sm { height: 20px; padding: 0 7px; font-size: 10.5px; }
    &--s-md { height: 22px; padding: 0 8px; font-size: 11px; }
    &--s-lg { height: 26px; padding: 0 10px; font-size: 12px; }
    &--s-xl { height: 30px; padding: 0 12px; font-size: 13px; }

    &__icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
}
</style>
