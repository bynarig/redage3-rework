<script setup lang="ts">
import { computed } from 'vue'

export type IosSegmentedItem = {
    label: string
    value: string | number
    icon?: string
    disabled?: boolean
}

export type IosSegmentedSize = 'sm' | 'md' | 'lg'

const model = defineModel<string | number>()

const props = withDefaults(defineProps<{
    items: string[] | IosSegmentedItem[]
    size?: IosSegmentedSize
    fullWidth?: boolean
    disabled?: boolean
}>(), {
    size: 'md',
    fullWidth: false,
    disabled: false,
})

const normalized = computed<IosSegmentedItem[]>(() =>
    (props.items as (string | IosSegmentedItem)[]).map(item =>
        typeof item === 'string' ? { label: item, value: item } : item
    )
)

const activeIndex = computed(() =>
    normalized.value.findIndex(item => item.value === model.value)
)

function select(item: IosSegmentedItem) {
    if (props.disabled || item.disabled) return
    model.value = item.value
}
</script>

<template>
    <div
        class="ios-seg"
        :class="[`ios-seg--${size}`, { 'ios-seg--full': fullWidth, 'ios-seg--disabled': disabled }]"
        role="group"
    >
        <div
            class="ios-seg__track"
            :style="{ '--seg-count': normalized.length }"
        >
            <div
                v-if="activeIndex >= 0"
                class="ios-seg__pill"
                :style="{ transform: `translateX(${activeIndex * 100}%)` }"
                aria-hidden="true"
            />
            <button
                v-for="item in normalized"
                :key="String(item.value)"
                type="button"
                class="ios-seg__item"
                :class="{
                    'ios-seg__item--active': item.value === model,
                    'ios-seg__item--disabled': item.disabled,
                }"
                :disabled="disabled || item.disabled"
                :aria-pressed="item.value === model"
                @click="select(item)"
            >
                <span v-if="item.icon" class="ios-seg__icon" v-html="item.icon" aria-hidden="true" />
                <span class="ios-seg__label">{{ item.label }}</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.ios-seg {
    display: inline-flex;
}

.ios-seg--full {
    display: flex;
    width: 100%;
}

.ios-seg--full .ios-seg__track {
    flex: 1;
}

.ios-seg__track {
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--seg-count), 1fr);
    background: var(--ui-fill-quaternary);
    border-radius: var(--ui-radius);
    padding: 2px;
}

/* Sliding active pill — positioned inside the 2px padding offset */
.ios-seg__pill {
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: 2px;
    width: calc((100% - 4px) / var(--seg-count));
    background: var(--ui-bg-elevated);
    border-radius: calc(var(--ui-radius) - 2px);
    box-shadow: var(--ui-shadow-xs);
    transition: transform var(--ui-dur) var(--ui-ease);
    pointer-events: none;
    z-index: 0;
}

.ios-seg__item {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: calc(var(--ui-radius) - 2px);
    font-family: var(--ui-font);
    font-weight: var(--ui-fw-medium);
    color: var(--ui-label-secondary);
    transition: color var(--ui-dur-fast) var(--ui-ease);
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
}

.ios-seg--sm .ios-seg__item {
    padding: 4px 10px;
    font-size: 13px;
    min-height: 28px;
}

.ios-seg--md .ios-seg__item {
    padding: 6px 14px;
    font-size: 15px;
    min-height: 32px;
}

.ios-seg--lg .ios-seg__item {
    padding: 8px 18px;
    font-size: 17px;
    min-height: 38px;
}

.ios-seg__item--active {
    color: var(--ui-label);
}

.ios-seg__item:not(.ios-seg__item--active):not(:disabled):active {
    color: var(--ui-label);
}

.ios-seg__item--disabled {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

.ios-seg--disabled .ios-seg__item {
    opacity: 0.4;
    cursor: not-allowed;
    pointer-events: none;
}

.ios-seg__icon {
    display: flex;
    align-items: center;
    width: 1em;
    height: 1em;
    margin-right: 5px;
}

.ios-seg__label {
    -webkit-user-select: none;
    user-select: none;
}
</style>
