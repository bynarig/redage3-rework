<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: boolean
    disabled?: boolean
    color?: string
}>(), {
    disabled: false,
    color: '#34c759',
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    'change': [value: boolean]
}>()

const toggle = () => {
    if (props.disabled) return
    const next = !props.modelValue
    emit('update:modelValue', next)
    emit('change', next)
}
</script>

<template>
    <button
        class="toggle"
        :class="{
            'toggle--on':       modelValue,
            'toggle--disabled': disabled,
        }"
        :style="modelValue ? { '--toggle-color': color } : {}"
        role="switch"
        :aria-checked="modelValue"
        :disabled="disabled"
        @click="toggle"
    >
        <!-- Track symbols -->
        <span class="toggle__symbol toggle__symbol--on" aria-hidden="true">|</span>
        <span class="toggle__symbol toggle__symbol--off" aria-hidden="true">○</span>

        <!-- Sliding thumb -->
        <span class="toggle__thumb" />
    </button>
</template>

<style scoped>
.toggle {
    --toggle-color: #34c759;

    position: relative;
    display: inline-flex;
    align-items: center;
    width: 51px;
    height: 31px;
    border-radius: 9999px;
    border: none;
    padding: 0;
    cursor: pointer;
    background: rgba(120, 120, 128, 0.22);
    transition: background 0.22s ease;
    -webkit-tap-highlight-color: transparent;
    flex-shrink: 0;
    overflow: hidden;
}

.toggle--on {
    background: var(--toggle-color);
}

.toggle--disabled {
    opacity: 0.38;
    pointer-events: none;
}

/* Symbols (I / O) */
.toggle__symbol {
    position: absolute;
    font-size: 11px;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1;
    pointer-events: none;
    transition: opacity 0.2s ease;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

.toggle__symbol--on {
    left: 8px;
    opacity: 0;
}

.toggle__symbol--off {
    right: 8px;
    opacity: 1;
    font-size: 9px;
    color: rgba(120, 120, 128, 0.7);
}

.toggle--on .toggle__symbol--on  { opacity: 1; }
.toggle--on .toggle__symbol--off { opacity: 0; }

/* Thumb */
.toggle__thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.18),
        0 1px 2px rgba(0, 0, 0, 0.12),
        0 0 0 0.5px rgba(0, 0, 0, 0.06);
    transition: transform 0.24s cubic-bezier(0.34, 1.1, 0.64, 1);
    pointer-events: none;
    will-change: transform;
}

.toggle--on .toggle__thumb {
    transform: translateX(20px);
}

/* Active press feedback */
.toggle:active:not(.toggle--disabled) .toggle__thumb {
    width: 31px;
}

.toggle--on:active:not(.toggle--disabled) .toggle__thumb {
    transform: translateX(16px);
    width: 31px;
}

/* ════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
    .toggle {
        background: rgba(120, 120, 128, 0.36);
    }

    .toggle__thumb {
        box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.45),
            0 1px 3px rgba(0, 0, 0, 0.3),
            0 0 0 0.5px rgba(255, 255, 255, 0.08);
    }

    .toggle__symbol--off {
        color: rgba(235, 235, 245, 0.4);
    }
}
</style>
