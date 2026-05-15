<script setup lang="ts">
const props = withDefaults(defineProps<{
    dark?: boolean
    disabled?: boolean
    color?: string
}>(), {
    dark: false,
    disabled: false,
    color: '#007AFF',
})

const model = defineModel<boolean>({ default: false })

const toggle = () => {
    if (!props.disabled) model.value = !model.value
}
</script>

<template>
    <button
        class="ios-cb"
        :class="{
            'ios-cb--checked':  model,
            'ios-cb--dark':     dark,
            'ios-cb--disabled': disabled,
        }"
        :style="model ? { '--ios-cb-color': props.color } : {}"
        role="checkbox"
        :aria-checked="model"
        :disabled="disabled"
        @click="toggle"
    >
        <svg
            v-if="model"
            class="ios-cb__check"
            viewBox="0 0 12 9"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M1 4.5L4.5 8L11 1"
                stroke="currentColor"
                stroke-width="1.7"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
    </button>
</template>

<style scoped>
.ios-cb {
    --ios-cb-color: #007AFF;
    --size: 22px;

    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--size);
    height: var(--size);
    border-radius: 50%;
    border: 1.5px solid var(--ui-border);
    background: transparent;
    cursor: pointer;
    padding: 0;
    flex-shrink: 0;
    transition:
        background 0.18s var(--ui-ease),
        border-color 0.18s var(--ui-ease),
        transform 0.12s var(--ui-ease-spring);
    -webkit-tap-highlight-color: transparent;
}

.ios-cb:active:not(.ios-cb--disabled) {
    transform: scale(0.9);
}

.ios-cb--checked {
    background: var(--ios-cb-color);
    border-color: var(--ios-cb-color);
}

.ios-cb--dark {
    border-color: var(--ui-fill);
}

.ios-cb--dark.ios-cb--checked {
    border-color: var(--ios-cb-color);
}

.ios-cb--disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
}

.ios-cb__check {
    width: 12px;
    height: 9px;
    color: #ffffff;
    flex-shrink: 0;
}
</style>
