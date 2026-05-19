<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { z } from 'zod'

export type InputValidationState = { valid: boolean; error: string }

export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant = 'default' | 'glass'

const model = defineModel<string>({ default: '' })

const props = withDefaults(defineProps<{
    placeholder?: string
    type?: string
    icon?: string
    isFocus?: boolean
    updateLang?: (lang: string) => void
    label?: string
    error?: string
    schema?: z.ZodTypeAny
    hint?: string
    required?: boolean
    disabled?: boolean
    size?: InputSize
    variant?: InputVariant
}>(), {
    type: 'text',
    size: 'md',
    variant: 'default',
    required: false,
    disabled: false,
})

const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const validationError = ref('')

const enLower = 'abcdefghijklmnopqrstuvwxyz'
const rusLower = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'

const displayError = computed(() => props.error || validationError.value)
const hasError = computed(() => !!displayError.value)

function validate(val: string): boolean {
    if (!props.schema) return true
    const result = props.schema.safeParse(val)
    if (!result.success) {
        validationError.value = result.error.issues[0]?.message ?? 'Invalid value'
        return false
    }
    validationError.value = ''
    return true
}

function onInput(e: Event) {
    const val = (e.target as HTMLInputElement).value
    model.value = val
    if (validationError.value) validationError.value = ''
    if (!props.updateLang || !val.length) return
    const last = (val[val.length - 1] ?? '').toLowerCase()
    if (enLower.includes(last)) props.updateLang('en')
    else if (rusLower.includes(last)) props.updateLang('ru')
}

function onFocus() {
    isFocused.value = true
}

function onBlur() {
    isFocused.value = false
    validate(model.value)
}

watch(() => props.isFocus, (val) => {
    if (val) inputRef.value?.focus()
})

defineExpose({
    focus: () => inputRef.value?.focus(),
    validate: () => validate(model.value),
})
</script>

<template>
    <div
        class="inp-root"
        :class="[`inp-root--${size}`, `inp-root--${variant}`, { 'inp-root--disabled': disabled }]"
    >
        <label v-if="label" class="inp-label">
            {{ label }}
            <span v-if="required" class="inp-required" aria-hidden="true">*</span>
        </label>

        <div
            class="inp-wrap"
            :class="{
                'inp-wrap--focus': isFocused,
                'inp-wrap--error': hasError,
            }"
            @click="inputRef?.focus()"
        >
            <span v-if="icon" :class="['inp-icon', icon]" aria-hidden="true" />
            <input
                ref="inputRef"
                class="inp-field"
                :type="type === 'password' ? 'password' : 'text'"
                :value="model"
                :placeholder="placeholder"
                :disabled="disabled"
                :required="required"
                autocomplete="off"
                @input="onInput"
                @focus="onFocus"
                @blur="onBlur"
            />
        </div>

        <Transition name="inp-msg">
            <span
                v-if="displayError || hint"
                :key="displayError ? 'error' : 'hint'"
                class="inp-msg"
                :class="{ 'inp-msg--error': hasError }"
            >
                {{ displayError || hint }}
            </span>
        </Transition>
    </div>
</template>

<style scoped>
.inp-root {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.inp-root--disabled {
    opacity: 0.5;
    pointer-events: none;
}

/* Label */
.inp-label {
    font-family: var(--ui-font);
    font-weight: var(--ui-fw-medium);
    color: var(--ui-label-secondary);
    margin-bottom: 6px;
    display: flex;
    align-items: center;
}

.inp-root--sm .inp-label { font-size: 12px; }
.inp-root--md .inp-label { font-size: 13px; }
.inp-root--lg .inp-label { font-size: 14px; }

.inp-required {
    color: var(--ui-destructive);
    margin-left: 3px;
}

/* Wrapper */
.inp-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    border: 2px solid rgba(253, 255, 252, 0.4);
    border-radius: 6px;
    box-sizing: border-box;
    transition: border-color var(--ui-dur) var(--ui-ease), background var(--ui-dur) var(--ui-ease);
    cursor: text;
}

.inp-root--sm .inp-wrap  { min-height: 48px; padding: 0 14px; }
.inp-root--md .inp-wrap  { min-height: 60px; padding: 0 20px; }
.inp-root--lg .inp-wrap  { min-height: 72px; padding: 0 24px; }

.inp-wrap--focus {
    border-color: var(--ui-accent);
    background: rgba(253, 255, 252, 0.06);
}

.inp-wrap--error {
    border-color: var(--ui-destructive);
}

.inp-wrap--error.inp-wrap--focus {
    border-color: var(--ui-destructive);
}

/* Glass variant */
.inp-root--glass .inp-wrap {
    background: rgba(255, 255, 255, 0.05);
    -webkit-backdrop-filter: blur(12px) saturate(150%);
    backdrop-filter: blur(12px) saturate(150%);
    border-color: rgba(255, 255, 255, 0.25);
}

.inp-root--glass .inp-wrap--focus {
    background: rgba(255, 255, 255, 0.10);
    border-color: var(--ui-accent);
}

/* Icon */
.inp-icon {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.55);
    margin-right: 14px;
    transition: color var(--ui-dur) var(--ui-ease);
}

.inp-root--sm .inp-icon  { font-size: 15px; }
.inp-root--md .inp-icon  { font-size: 18px; }
.inp-root--lg .inp-icon  { font-size: 20px; }

.inp-wrap--focus .inp-icon {
    color: var(--ui-accent);
}

/* Input field */
.inp-field {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #ffffff;
    caret-color: #808080;
    font-family: var(--ui-font);
    width: 100%;
}

.inp-root--sm .inp-field { font-size: 14px; }
.inp-root--md .inp-field { font-size: 16px; }
.inp-root--lg .inp-field { font-size: 18px; }

.inp-field::placeholder {
    color: rgba(255, 255, 255, 0.45);
}

.inp-field::-webkit-input-placeholder {
    color: rgba(255, 255, 255, 0.45);
}

/* Message row */
.inp-msg {
    font-family: var(--ui-font);
    font-size: 12px;
    margin-top: 5px;
    color: var(--ui-label-tertiary);
    line-height: 1.4;
}

.inp-msg--error {
    color: var(--ui-destructive);
}

</style>
