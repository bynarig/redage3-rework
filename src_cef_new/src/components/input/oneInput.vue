<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{
    placeholder?: string
    type?: string
    disabled?: boolean
}>(), {
    type: 'text',
    disabled: false,
})

defineOptions({ inheritAttrs: false })

const inputRef = ref<HTMLInputElement>()

defineExpose({ focus: () => inputRef.value?.focus() })
</script>

<template>
    <input
        ref="inputRef"
        v-bind="$attrs"
        v-model="model"
        :type="type === 'password' ? 'password' : 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
    />
</template>
