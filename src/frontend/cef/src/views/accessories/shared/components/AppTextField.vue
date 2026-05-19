<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
    modelValue: string
    placeholder?: string
    type?: string
    clearable?: boolean
    disabled?: boolean
    readonly?: boolean
    autofocus?: boolean
}>(), {
    placeholder: '',
    type: 'text',
    clearable: false,
    disabled: false,
    readonly: false,
    autofocus: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    'clear': []
    'focus': []
    'blur': []
}>()

const focused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const showClear = computed(() => props.clearable && props.modelValue.length > 0 && !props.readonly && !props.disabled)

const onInput = (e: Event) => {
    emit('update:modelValue', (e.target as HTMLInputElement).value)
}

const onFocus = () => {
    focused.value = true
    emit('focus')
}

const onBlur = () => {
    focused.value = false
    emit('blur')
}

const clear = () => {
    emit('update:modelValue', '')
    emit('clear')
    inputRef.value?.focus()
}

const focus = () => inputRef.value?.focus()

defineExpose({ focus })
</script>

<template>
    <div
        class="textfield"
        :class="{
            'textfield--focused':  focused,
            'textfield--disabled': disabled,
            'textfield--readonly': readonly,
        }"
        @click="focus"
    >
        <input
            ref="inputRef"
            class="textfield__input"
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            :disabled="disabled"
            :readonly="readonly"
            :autofocus="autofocus"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
        />

        <button
            v-if="showClear"
            class="textfield__clear"
            tabindex="-1"
            aria-label="Clear"
            @mousedown.prevent="clear"
        >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="7.25" fill="currentColor" opacity="0.28" />
                <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" stroke-width="1.4"
                      stroke-linecap="round" />
            </svg>
        </button>

        <div class="textfield__separator" />
    </div>
</template>

<style scoped>
.textfield {
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 0;
    cursor: text;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
}

/* Bottom separator line */
.textfield__separator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 0.5px;
    background: rgba(60, 60, 67, 0.2);
    transition: background 0.18s ease, height 0.18s ease;
    pointer-events: none;
}

.textfield--focused .textfield__separator {
    height: 1px;
    background: #007aff;
}

/* Input */
.textfield__input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 17px;
    font-weight: 400;
    color: #1d1d1f;
    line-height: 1.3;
    caret-color: #007aff;
    min-width: 0;
}

.textfield__input::placeholder {
    color: rgba(60, 60, 67, 0.3);
}

/* Clear button */
.textfield__clear {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: rgba(60, 60, 67, 0.55);
    transition: opacity 0.12s ease;
}

.textfield__clear:active {
    opacity: 0.5;
}

/* Disabled */
.textfield--disabled {
    opacity: 0.4;
    pointer-events: none;
}

/* Readonly */
.textfield--readonly {
    cursor: default;
}

.textfield--readonly .textfield__input {
    cursor: default;
    color: rgba(60, 60, 67, 0.6);
    caret-color: transparent;
}

/* ════════════════════════════════════════════════
   DARK MODE
════════════════════════════════════════════════ */
@media (prefers-color-scheme: dark) {
    .textfield__input {
        color: #ffffff;
    }

    .textfield__input::placeholder {
        color: rgba(235, 235, 245, 0.3);
    }

    .textfield__separator {
        background: rgba(235, 235, 245, 0.18);
    }

    .textfield--focused .textfield__separator {
        background: #0a84ff;
    }

    .textfield__clear {
        color: rgba(235, 235, 245, 0.5);
    }

    .textfield--readonly .textfield__input {
        color: rgba(235, 235, 245, 0.5);
    }
}
</style>
