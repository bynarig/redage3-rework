<script setup lang="ts">
export type IosTagColor = 'default' | 'accent' | 'success' | 'warning' | 'destructive'
export type IosTagSize = 'xs' | 'sm' | 'md'

withDefaults(defineProps<{
    label?: string
    color?: IosTagColor
    removable?: boolean
    selected?: boolean
    size?: IosTagSize
}>(), {
    color: 'default',
    removable: false,
    selected: false,
    size: 'sm',
})

const emit = defineEmits<{
    click: [e: MouseEvent]
    remove: []
}>()
</script>

<template>
    <span
        class="ios-tag"
        :class="[
            `ios-tag--${size}`,
            selected ? 'ios-tag--selected' : `ios-tag--${color}`,
            { 'ios-tag--removable': removable },
        ]"
        @click="emit('click', $event)"
    >
        <slot>{{ label }}</slot>
        <button
            v-if="removable"
            type="button"
            class="ios-tag__remove"
            aria-label="Remove"
            @click.stop="emit('remove')"
        >
            <svg viewBox="0 0 10 10" fill="none" aria-hidden="true">
                <path
                    d="M1.5 1.5L8.5 8.5M8.5 1.5L1.5 8.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
            </svg>
        </button>
    </span>
</template>

<style scoped>
.ios-tag {
    display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    font-family: var(--ui-font);
    font-weight: var(--ui-fw-medium);
    white-space: nowrap;
    transition: background var(--ui-dur-fast), color var(--ui-dur-fast), opacity var(--ui-dur-fast);
}

.ios-tag--xs { padding: 2px 8px;  font-size: 11px; min-height: 20px; }
.ios-tag--sm { padding: 3px 10px; font-size: 13px; min-height: 24px; }
.ios-tag--md { padding: 5px 13px; font-size: 15px; min-height: 30px; }

.ios-tag--default     { background: var(--ui-fill-secondary);   color: var(--ui-label); }
.ios-tag--accent      { background: var(--ui-accent-tint);      color: var(--ui-accent); }
.ios-tag--success     { background: var(--ui-success-tint);     color: var(--ui-success); }
.ios-tag--warning     { background: var(--ui-warning-tint);     color: var(--ui-warning); }
.ios-tag--destructive { background: var(--ui-destructive-tint); color: var(--ui-destructive); }
.ios-tag--selected    { background: var(--ui-accent);           color: var(--ui-accent-fg); }

.ios-tag--removable { cursor: pointer; }
.ios-tag--removable:active { opacity: 0.7; }

.ios-tag__remove {
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0;
    margin-left: 4px;
    color: inherit;
    opacity: 0.55;
    transition: opacity var(--ui-dur-fast);
    flex-shrink: 0;
    -webkit-tap-highlight-color: transparent;
}

.ios-tag__remove:hover { opacity: 1; }
.ios-tag__remove:active { opacity: 0.4; }

.ios-tag--xs .ios-tag__remove { width: 10px; height: 10px; }
.ios-tag--sm .ios-tag__remove { width: 12px; height: 12px; }
.ios-tag--md .ios-tag__remove { width: 14px; height: 14px; }

.ios-tag__remove svg {
    width: 100%;
    height: 100%;
}
</style>
