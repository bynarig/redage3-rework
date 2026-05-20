<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export type UiSelectColor = 'primary' | 'error' | 'neutral'
export type UiSelectVariant = 'outline' | 'soft' | 'subtle' | 'none'
export type UiSelectSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type Primitive = string | number
type Item = Primitive | { label: string; value?: unknown; disabled?: boolean; icon?: string }

const model = defineModel<unknown>()

const props = withDefaults(defineProps<{
    items?: Item[]
    placeholder?: string
    valueKey?: string
    labelKey?: string
    color?: UiSelectColor
    variant?: UiSelectVariant
    size?: UiSelectSize
    icon?: string
    leadingIcon?: string
    trailingIcon?: string
    searchable?: boolean
    multiple?: boolean
    clearable?: boolean
    disabled?: boolean
    required?: boolean
    loading?: boolean
    arrow?: boolean
    class?: string
}>(), {
    items: () => [],
    color: 'primary',
    variant: 'outline',
    size: 'md',
    searchable: false,
    multiple: false,
    clearable: false,
    disabled: false,
    arrow: true,
})

defineOptions({ inheritAttrs: false })

const open = ref(false)
const triggerEl = ref<HTMLElement | null>(null)
const menuEl = ref<HTMLElement | null>(null)

function isObjectItem(it: Item): it is { label: string; value?: unknown; disabled?: boolean; icon?: string } {
    return typeof it === 'object' && it !== null
}

function labelOf(it: Item): string {
    if (isObjectItem(it)) return String((it as any)[props.labelKey ?? 'label'] ?? it.label ?? '')
    return String(it)
}

function valueOf(it: Item): unknown {
    if (isObjectItem(it)) return (it as any)[props.valueKey ?? 'value'] ?? (it as any).label
    return it
}

function disabledOf(it: Item): boolean {
    return isObjectItem(it) && !!it.disabled
}

const selectedLabel = computed(() => {
    const found = props.items?.find(it => valueOf(it) === model.value)
    return found ? labelOf(found) : ''
})

function pick(it: Item) {
    if (disabledOf(it)) return
    model.value = valueOf(it)
    open.value = false
}

function toggle() {
    if (props.disabled) return
    open.value = !open.value
}

function onDocClick(e: MouseEvent) {
    const t = e.target as Node | null
    if (!t) return
    if (triggerEl.value?.contains(t) || menuEl.value?.contains(t)) return
    open.value = false
}

watch(open, (v) => {
    if (v) document.addEventListener('mousedown', onDocClick)
    else document.removeEventListener('mousedown', onDocClick)
})

const wrapClass = computed(() => [
    'ui-select',
    `ui-select--c-${props.color}`,
    `ui-select--v-${props.variant}`,
    `ui-select--s-${props.size}`,
    { 'ui-select--open': open.value, 'ui-select--disabled': props.disabled },
    props.class,
])
</script>

<template>
    <div :class="wrapClass" v-bind="$attrs">
        <button
            ref="triggerEl"
            type="button"
            class="ui-select__trigger"
            :disabled="disabled"
            :aria-expanded="open"
            @click="toggle"
        >
            <span v-if="leadingIcon || icon" class="ui-select__icon">{{ leadingIcon ?? icon }}</span>
            <span class="ui-select__value" :class="{ 'ui-select__value--placeholder': !selectedLabel }">
                {{ selectedLabel || placeholder || 'Select…' }}
            </span>
            <span v-if="arrow" class="ui-select__chev" aria-hidden="true">
                <svg viewBox="0 0 12 12" width="12" height="12"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </span>
        </button>

        <transition name="ui-select-pop">
            <div v-if="open" ref="menuEl" class="ui-select__menu" role="listbox">
                <button
                    v-for="(it, i) in items"
                    :key="i"
                    type="button"
                    class="ui-select__option"
                    :class="{ 'ui-select__option--active': valueOf(it) === model, 'ui-select__option--disabled': disabledOf(it) }"
                    role="option"
                    :aria-selected="valueOf(it) === model"
                    :disabled="disabledOf(it)"
                    @click="pick(it)"
                >
                    <span class="ui-select__option-label">{{ labelOf(it) }}</span>
                    <span v-if="valueOf(it) === model" class="ui-select__option-check">✓</span>
                </button>
                <div v-if="!items?.length" class="ui-select__empty">No options</div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.ui-select {
    --_c: var(--glass-accent);
    --_c-soft: var(--glass-accent-soft);

    position: relative;
    display: inline-block;
    width: 100%;
    max-width: 320px;
    color: var(--glass-text);

    &--c-error   { --_c: var(--glass-danger); --_c-soft: var(--glass-danger-soft); }
    &--c-neutral { --_c: var(--glass-text); --_c-soft: var(--glass-recessed-bg); }

    &__trigger {
        all: unset;
        position: relative;
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        height: 40px;
        padding: 0 14px;
        cursor: pointer;
        background: var(--glass-pane-bg);
        backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
        -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
        border: 1px solid var(--glass-border);
        border-radius: var(--glass-radius);
        font-size: 14px;
        color: inherit;
        isolation: isolate;
        transition: border-color 200ms ease, background 220ms ease;

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

        &:hover:not(:disabled) {
            background: var(--glass-pane-bg-hover);
        }

        &:focus-visible {
            outline: none;
            border-color: var(--_c);
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--_c) 24%, transparent);
        }
    }

    .ui-select--v-soft & .ui-select__trigger    { background: var(--_c-soft); border-color: transparent; }
    .ui-select--v-subtle & .ui-select__trigger  { background: var(--glass-recessed-bg); border-color: var(--glass-border-soft); }
    .ui-select--v-none & .ui-select__trigger    { background: transparent; border-color: transparent; backdrop-filter: none; &::before { display: none; } }

    .ui-select--s-xs & .ui-select__trigger { height: 28px; padding: 0 10px; font-size: 12px; border-radius: var(--glass-radius-sm); }
    .ui-select--s-sm & .ui-select__trigger { height: 34px; padding: 0 12px; font-size: 13px; border-radius: var(--glass-radius-sm); }
    .ui-select--s-lg & .ui-select__trigger { height: 46px; font-size: 15px; }
    .ui-select--s-xl & .ui-select__trigger { height: 54px; font-size: 16px; padding: 0 18px; }

    &--disabled .ui-select__trigger { opacity: 0.5; cursor: not-allowed; }

    &__value {
        position: relative;
        z-index: 1;
        flex: 1;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &--placeholder { color: var(--glass-text-subtle); }
    }

    &__icon {
        position: relative;
        z-index: 1;
        color: var(--glass-text-muted);
    }

    &__chev {
        position: relative;
        z-index: 1;
        color: var(--glass-text-muted);
        transition: transform 220ms ease;
    }

    &--open .ui-select__chev { transform: rotate(180deg); color: var(--_c); }

    &__menu {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        right: 0;
        z-index: 50;
        max-height: 260px;
        overflow-y: auto;
        padding: 6px;
        background: var(--glass-strong-bg);
        backdrop-filter: blur(28px) saturate(180%);
        -webkit-backdrop-filter: blur(28px) saturate(180%);
        border: 1px solid var(--glass-border);
        border-radius: var(--glass-radius);
        box-shadow: var(--glass-shadow-lg);
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    &__option {
        all: unset;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 9px 12px;
        font-size: 13.5px;
        color: var(--glass-text);
        border-radius: calc(var(--glass-radius) - 6px);
        cursor: pointer;
        transition: background 140ms ease;

        &:hover:not(.ui-select__option--disabled) { background: var(--glass-pane-bg); }
        &--active { background: var(--glass-accent-soft); color: var(--glass-accent); font-weight: 540; }
        &--disabled { opacity: 0.4; cursor: not-allowed; }
    }

    &__option-check { font-size: 11px; }

    &__empty {
        padding: 12px;
        font-size: 13px;
        color: var(--glass-text-subtle);
        text-align: center;
    }
}

.ui-select-pop-enter-active, .ui-select-pop-leave-active {
    transition: opacity 160ms ease, transform 160ms cubic-bezier(0.34, 1.56, 0.64, 1);
    transform-origin: top center;
}
.ui-select-pop-enter-from, .ui-select-pop-leave-to {
    opacity: 0;
    transform: translateY(-6px) scale(0.98);
}
</style>
