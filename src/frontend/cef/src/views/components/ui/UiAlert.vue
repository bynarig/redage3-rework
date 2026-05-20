<script setup lang="ts">
import { computed } from 'vue'

export type UiAlertColor = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
export type UiAlertVariant = 'solid' | 'outline' | 'soft' | 'subtle'
export type UiAlertOrientation = 'horizontal' | 'vertical'

const props = withDefaults(defineProps<{
    title?: string
    description?: string
    color?: UiAlertColor
    variant?: UiAlertVariant
    icon?: string
    orientation?: UiAlertOrientation
    actions?: Array<{ label: string; color?: string; variant?: string; onClick?: () => void }>
    class?: string
}>(), {
    color: 'primary',
    variant: 'soft',
    orientation: 'horizontal',
})

defineOptions({ inheritAttrs: false })

const classList = computed(() => [
    'ui-alert',
    `ui-alert--c-${props.color}`,
    `ui-alert--v-${props.variant}`,
    `ui-alert--o-${props.orientation}`,
    props.class,
])
</script>

<template>
    <div :class="classList" role="alert" v-bind="$attrs">
        <span v-if="icon || $slots.icon" class="ui-alert__icon">
            <slot name="icon">{{ icon }}</slot>
        </span>
        <div class="ui-alert__body">
            <div v-if="title || $slots.title" class="ui-alert__title">
                <slot name="title">{{ title }}</slot>
            </div>
            <div v-if="description || $slots.description" class="ui-alert__desc">
                <slot name="description">{{ description }}</slot>
            </div>
            <div v-if="$slots.actions" class="ui-alert__actions">
                <slot name="actions" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ui-alert {
    --_c: var(--glass-accent);
    --_c-soft: var(--glass-accent-soft);

    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 18px;
    background: var(--_c-soft);
    border: 1px solid color-mix(in srgb, var(--_c) 28%, var(--glass-border));
    border-radius: var(--glass-radius);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
    color: var(--glass-text);
    box-shadow: var(--glass-shadow-sm);
    isolation: isolate;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        border-radius: inherit;
        background: linear-gradient(180deg, var(--glass-rim-top) 0%, transparent 28%);
        mix-blend-mode: overlay;
        opacity: 0.55;
    }

    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 12%;
        bottom: 12%;
        width: 3px;
        border-radius: 3px;
        background: var(--_c);
        opacity: 0.85;
    }

    &--c-primary   { --_c: var(--glass-accent);  --_c-soft: var(--glass-accent-soft); }
    &--c-secondary { --_c: var(--glass-info);    --_c-soft: var(--glass-info-soft); }
    &--c-success   { --_c: var(--glass-success); --_c-soft: var(--glass-success-soft); }
    &--c-info      { --_c: var(--glass-info);    --_c-soft: var(--glass-info-soft); }
    &--c-warning   { --_c: var(--glass-warning); --_c-soft: var(--glass-warning-soft); }
    &--c-error     { --_c: var(--glass-danger);  --_c-soft: var(--glass-danger-soft); }
    &--c-neutral   { --_c: var(--glass-text);    --_c-soft: var(--glass-recessed-bg); }

    &--v-solid {
        background: var(--_c);
        color: var(--glass-text-on-tint);
        border-color: color-mix(in srgb, var(--_c) 70%, black 30%);
        &::after { background: rgba(255, 255, 255, 0.7); }
    }

    &--v-outline {
        background: transparent;
        border-color: var(--_c);
        backdrop-filter: none;
        &::before { display: none; }
    }

    &--v-subtle {
        background: var(--glass-recessed-bg);
        border-color: var(--glass-border-soft);
        &::after { background: var(--_c); }
    }

    &--o-vertical {
        flex-direction: column;
        align-items: stretch;
    }

    &__icon {
        position: relative;
        z-index: 1;
        flex: 0 0 auto;
        width: 28px;
        height: 28px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: var(--_c);
        background: color-mix(in srgb, var(--_c) 14%, transparent);
        border-radius: 50%;
    }

    &__body {
        position: relative;
        z-index: 1;
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    &__title {
        font-family: var(--ui-font-display);
        font-size: 18px;
        font-weight: 400;
        letter-spacing: -0.01em;
        line-height: 1.2;
    }

    &__desc {
        font-size: 13.5px;
        line-height: 1.5;
        color: inherit;
        opacity: 0.85;
    }

    &__actions {
        display: flex;
        gap: 8px;
        margin-top: 6px;
    }
}
</style>
