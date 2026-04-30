<script setup lang="ts">
import './main.scss'
import { ref, watch } from 'vue'
// TODO: replace with Pinia store once @/views/player/newauthentication/store is migrated
// import { useAuthStore } from '@/views/player/newauthentication/store'

const props = defineProps<{
  placeholder?: string
  type?: string
  icon?: string
  setValue?: (val: string) => void
  value?: string
  isFocus?: boolean
  updateLang?: (lang: string) => void
  settingsClass?: boolean
  settingsMargin?: boolean
}>()

const TextInput = ref<HTMLInputElement>()
const focusInput = ref(false)

const enLower = 'abcdefghijklmnopqrstuvwxyz'
const rusLower = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'

watch(
  () => props.isFocus,
  (val) => { if (val) TextInput.value?.focus() },
)

watch(
  () => props.value,
  (val) => {
    if (!props.updateLang || !focusInput.value || !val?.length) return
    const last = val[val.length - 1].toLowerCase()
    if (enLower.includes(last)) props.updateLang('en')
    else if (rusLower.includes(last)) props.updateLang('ru')
  },
)

const OnClick = () => TextInput.value?.focus()

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
  <div
    class="main__input"
    :class="{ hover: focusInput, settings: settingsClass, 'm-0': settingsMargin }"
    @click="OnClick"
  >
    <span v-if="icon" :class="`main__input_icon ${icon}`" />
    <input
      ref="TextInput"
      :type="type === 'password' ? 'password' : 'text'"
      :value="value"
      :placeholder="placeholder"
      class="main__input_text"
      @input="(e) => setValue?.((e.target as HTMLInputElement).value)"
      @focus="onFuncFocus"
      @blur="onFuncBlur"
    />
  </div>
</template>
