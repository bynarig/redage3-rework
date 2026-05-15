<script setup lang="ts">
import { ref } from 'vue'

export type IosSearchSize = 'sm' | 'md' | 'lg'

const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{
    placeholder?: string
    disabled?: boolean
    size?: IosSearchSize
}>(), {
    placeholder: 'Search',
    disabled: false,
    size: 'md',
})

const emit = defineEmits<{
    clear: []
    submit: [value: string]
}>()

const inputRef = ref<HTMLInputElement>()

function handleClear() {
    model.value = ''
    emit('clear')
    inputRef.value?.focus()
}

function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') emit('submit', model.value)
}
</script>

<template>
    <div class="ios-search" :class="[`ios-search--${size}`, { 'ios-search--disabled': disabled }]">
        <div class="ios-search__inner">
            <svg class="ios-search__mag" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" stroke-width="1.5" />
                <path d="M10.5 10.5L14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <input
                ref="inputRef"
                v-model="model"
                class="ios-search__input"
                type="search"
                :placeholder="placeholder"
                :disabled="disabled"
                @keydown="handleKeydown"
            />
            <button
                v-if="model"
                type="button"
                class="ios-search__clear"
                aria-label="Clear"
                tabindex="-1"
                @click="handleClear"
            >
                <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path
                        d="M3 3L11 11M11 3L3 11"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                    />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.ios-search {
    display: flex;
    flex-direction: column;
}

.ios-search__inner {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--ui-fill);
    border-radius: 9999px;
    transition: background var(--ui-dur) var(--ui-ease), box-shadow var(--ui-dur) var(--ui-ease);
}

.ios-search:focus-within .ios-search__inner {
    background: var(--ui-fill-secondary);
    box-shadow: 0 0 0 3px var(--ui-accent-tint);
}

.ios-search__mag {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--ui-label-tertiary);
    pointer-events: none;
    flex-shrink: 0;
    transition: color var(--ui-dur) var(--ui-ease);
}

.ios-search:focus-within .ios-search__mag {
    color: var(--ui-accent);
}

.ios-search--sm .ios-search__inner { min-height: 32px; }
.ios-search--md .ios-search__inner { min-height: 36px; }
.ios-search--lg .ios-search__inner { min-height: 44px; }

.ios-search--sm .ios-search__mag { left: 9px; width: 13px; height: 13px; }
.ios-search--md .ios-search__mag { left: 11px; width: 14px; height: 14px; }
.ios-search--lg .ios-search__mag { left: 13px; width: 16px; height: 16px; }

.ios-search__input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    color: var(--ui-label);
    font-family: var(--ui-font);
    -webkit-appearance: none;
    appearance: none;
}

.ios-search__input::-webkit-search-cancel-button {
    -webkit-appearance: none;
    display: none;
}

.ios-search__input::placeholder {
    color: var(--ui-label-tertiary);
}

.ios-search--sm .ios-search__input { font-size: 14px; padding: 0 30px 0 28px; }
.ios-search--md .ios-search__input { font-size: 15px; padding: 0 34px 0 32px; }
.ios-search--lg .ios-search__input { font-size: 17px; padding: 0 42px 0 38px; }

.ios-search__clear {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    color: var(--ui-label-tertiary);
    transition: color var(--ui-dur-fast), opacity var(--ui-dur-fast);
    -webkit-tap-highlight-color: transparent;
}

.ios-search__clear:hover { color: var(--ui-label-secondary); }
.ios-search__clear:active { opacity: 0.6; }

.ios-search--sm .ios-search__clear { right: 9px; width: 14px; height: 14px; }
.ios-search--md .ios-search__clear { right: 11px; width: 16px; height: 16px; }
.ios-search--lg .ios-search__clear { right: 13px; width: 18px; height: 18px; }

.ios-search--sm .ios-search__clear svg,
.ios-search--md .ios-search__clear svg,
.ios-search--lg .ios-search__clear svg {
    width: 100%;
    height: 100%;
}

.ios-search--disabled .ios-search__inner {
    opacity: 0.5;
    pointer-events: none;
}
</style>
