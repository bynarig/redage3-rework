<script setup lang="ts">
import { computed, watch, ref } from 'vue'

export type UiTabsColor = 'primary' | 'secondary' | 'neutral'
export type UiTabsVariant = 'pill' | 'link' | 'underline'
export type UiTabsSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type UiTabsOrientation = 'horizontal' | 'vertical'

export interface UiTabItem {
    label?: string
    value?: string | number
    icon?: string
    disabled?: boolean
    slot?: string
    content?: string
}

const model = defineModel<string | number>()

const props = withDefaults(defineProps<{
    items?: UiTabItem[]
    color?: UiTabsColor
    variant?: UiTabsVariant
    size?: UiTabsSize
    orientation?: UiTabsOrientation
    class?: string
}>(), {
    items: () => [],
    color: 'primary',
    variant: 'pill',
    size: 'md',
    orientation: 'horizontal',
})

defineOptions({ inheritAttrs: false })

const internal = ref<string | number | undefined>(model.value ?? props.items[0]?.value ?? props.items[0]?.label)
watch(() => model.value, v => { internal.value = v })
watch(internal, v => { model.value = v })

function valueOf(it: UiTabItem) { return it.value ?? it.label ?? '' }

const wrapClass = computed(() => [
    'ui-tabs',
    `ui-tabs--c-${props.color}`,
    `ui-tabs--v-${props.variant}`,
    `ui-tabs--s-${props.size}`,
    `ui-tabs--o-${props.orientation}`,
    props.class,
])
</script>

<template>
    <div :class="wrapClass" v-bind="$attrs">
        <div class="ui-tabs__list" role="tablist">
            <button
                v-for="it in items"
                :key="String(valueOf(it))"
                type="button"
                class="ui-tabs__trigger"
                :class="{ 'ui-tabs__trigger--active': valueOf(it) === internal, 'ui-tabs__trigger--disabled': it.disabled }"
                :disabled="it.disabled"
                role="tab"
                :aria-selected="valueOf(it) === internal"
                @click="!it.disabled && (internal = valueOf(it))"
            >
                <span v-if="it.icon" class="ui-tabs__icon">{{ it.icon }}</span>
                <span class="ui-tabs__label">{{ it.label }}</span>
            </button>
        </div>
        <div v-if="$slots.default" class="ui-tabs__panel">
            <slot :value="internal" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ui-tabs {
    --_c: var(--glass-accent);

    display: flex;
    flex-direction: column;
    gap: 16px;
    color: var(--glass-text);

    &--c-primary   { --_c: var(--glass-accent); }
    &--c-secondary { --_c: var(--glass-info); }
    &--c-neutral   { --_c: var(--glass-text); }

    &--o-vertical {
        flex-direction: row;
        align-items: stretch;
    }

    &__list {
        display: inline-flex;
        gap: 4px;
        padding: 4px;
        background: var(--glass-pane-bg);
        backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
        -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
        border: 1px solid var(--glass-border);
        border-radius: var(--glass-radius);
        position: relative;
        isolation: isolate;
        align-self: flex-start;

        &::before {
            content: '';
            position: absolute;
            inset: 0;
            pointer-events: none;
            border-radius: inherit;
            background: linear-gradient(180deg, var(--glass-rim-top) 0%, transparent 50%);
            opacity: 0.5;
            mix-blend-mode: overlay;
        }
    }

    &--o-vertical .ui-tabs__list { flex-direction: column; align-self: stretch; }

    &__trigger {
        all: unset;
        position: relative;
        z-index: 1;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 0 14px;
        height: 30px;
        font-size: 13px;
        font-weight: 540;
        color: var(--glass-text-muted);
        border-radius: calc(var(--glass-radius) - 4px);
        cursor: pointer;
        transition: color 200ms ease, background 220ms ease;

        &:hover:not(.ui-tabs__trigger--disabled) { color: var(--glass-text); }

        &--active {
            color: var(--glass-text-on-tint);
            background: linear-gradient(180deg,
                color-mix(in srgb, var(--_c) 95%, white 5%),
                var(--_c));
            box-shadow: 0 4px 12px color-mix(in srgb, var(--_c) 28%, transparent),
                        0 1px 0 rgba(255, 255, 255, 0.32) inset;
        }

        &--disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }

    &--s-xs .ui-tabs__trigger { height: 24px; padding: 0 10px; font-size: 11px; }
    &--s-sm .ui-tabs__trigger { height: 26px; padding: 0 12px; font-size: 12px; }
    &--s-md .ui-tabs__trigger { height: 30px; padding: 0 14px; font-size: 13px; }
    &--s-lg .ui-tabs__trigger { height: 36px; padding: 0 18px; font-size: 14px; }
    &--s-xl .ui-tabs__trigger { height: 42px; padding: 0 22px; font-size: 15px; }

    // Variants
    &--v-link .ui-tabs__list,
    &--v-underline .ui-tabs__list {
        background: transparent;
        backdrop-filter: none;
        border: 0;
        border-radius: 0;
        padding: 0;
        gap: 18px;
        &::before { display: none; }
    }

    &--v-link .ui-tabs__trigger,
    &--v-underline .ui-tabs__trigger {
        background: transparent;
        box-shadow: none;
        padding: 0 2px;
        border-radius: 0;
        position: relative;

        &--active {
            color: var(--_c);
            background: transparent;
            box-shadow: none;
        }
    }

    &--v-underline .ui-tabs__trigger {
        padding-bottom: 8px;
        border-bottom: 2px solid transparent;

        &--active {
            border-bottom-color: var(--_c);
        }
    }

    &__panel {
        font-size: 14px;
        color: var(--glass-text-muted);
        line-height: 1.55;
    }
}
</style>
