<script setup lang="ts">
import { ref } from 'vue'
// TODO: replace with Pinia store once @/views/player/newauthentication/store is migrated
// import { useAuthStore } from '@/views/player/newauthentication/store'

const props = defineProps<{
  placeholder?: string
  type?: string
  setValue?: (val: string) => void
  value?: string
  cl?: string
}>()

const focusInput = ref(false)

const onFuncFocus = () => {
  focusInput.value = true
  // authStore.isInput = true
}

const onFuncBlur = () => {
  focusInput.value = false
  // authStore.isInput = false
}
</script>

<template>
  <input
    :type="type === 'password' ? 'password' : 'text'"
    :value="value"
    :placeholder="placeholder"
    :class="cl"
    @input="(e) => setValue?.((e.target as HTMLInputElement).value)"
    @focus="onFuncFocus"
    @blur="onFuncBlur"
  />
</template>
