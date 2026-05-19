<script setup lang="ts">
withDefaults(defineProps<{
    label?: string
    sublabel?: string
    dark?: boolean
    chevron?: boolean
    separator?: boolean
    disabled?: boolean
}>(), {
    dark: false,
    chevron: false,
    separator: true,
    disabled: false,
})

const emit = defineEmits<{ click: [e: MouseEvent] }>()
</script>

<template>
    <div
        class="ios-list-item"
        :class="{
            'ios-list-item--dark':      dark,
            'ios-list-item--separator': separator,
            'ios-list-item--disabled':  disabled,
            'ios-list-item--chevron':   chevron,
        }"
        @click="!disabled && emit('click', $event)"
    >
        <span v-if="$slots.left" class="ios-list-item__left">
            <slot name="left" />
        </span>

        <span class="ios-list-item__content">
            <span v-if="label" class="ios-list-item__label">{{ label }}</span>
            <span v-if="sublabel" class="ios-list-item__sublabel">{{ sublabel }}</span>
        </span>

        <span v-if="$slots.right || chevron" class="ios-list-item__right">
            <slot name="right" />
            <svg
                v-if="chevron && !$slots.right"
                class="ios-list-item__chevron"
                viewBox="0 0 8 13"
                fill="none"
                aria-hidden="true"
            >
                <path d="M1.5 1.5L6.5 6.5L1.5 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </span>
    </div>
</template>

<style scoped>
.ios-list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 16px;
    min-height: 44px;
    cursor: default;
    transition: background 0.1s ease;
    position: relative;
}

.ios-list-item--chevron {
    cursor: pointer;
}

.ios-list-item--chevron:active:not(.ios-list-item--disabled) {
    background: var(--ui-fill-quaternary);
}

.ios-list-item--separator::after {
    content: '';
    position: absolute;
    left: 16px;
    right: 0;
    bottom: 0;
    height: 0.5px;
    background: var(--ui-separator);
    pointer-events: none;
}

.ios-list-item--disabled {
    opacity: 0.4;
    pointer-events: none;
}

/* Content */
.ios-list-item__content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.ios-list-item__label {
    font-size: 17px;
    font-weight: 400;
    color: var(--ui-label);
    font-family: var(--ui-font);
    line-height: 1.3;
}

.ios-list-item__sublabel {
    font-size: 13px;
    color: var(--ui-label-secondary);
    font-family: var(--ui-font);
    line-height: 1.3;
}

.ios-list-item--dark .ios-list-item__label {
    color: var(--ui-label);
}

/* Accessory slots */
.ios-list-item__left {
    display: flex;
    align-items: center;
    flex-shrink: 0;
}

.ios-list-item__right {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--ui-label-tertiary);
}

.ios-list-item__chevron {
    width: 8px;
    height: 13px;
    color: var(--ui-label-quaternary);
}
</style>
