<script setup lang="ts">
import './main.scss'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  keyCode?: number
  keyLocation?: number
  callback?: (code: number, clicked: boolean) => void
  click?: () => void
  classData?: string
  style?: string
  disabled?: boolean
  nonactive?: boolean
  keyDetector?: boolean
  keyDonate?: boolean
}>()

const buttonEl = ref<HTMLElement>()
const state = ref(false)
const laststate = ref(false)

const handleKeydown = (event: KeyboardEvent) => {
  if (props.nonactive) return
  if (props.disabled || state.value) return
  if (props.keyCode !== event.keyCode || props.keyLocation !== event.location) return

  if (props.callback !== undefined) {
    // Esc (27) is sent only on keyup to avoid opening the GTA pause menu
    if (props.keyCode !== 27) props.callback(props.keyCode, false)
  }

  if (laststate.value) {
    laststate.value = false
    setTimeout(() => { laststate.value = true }, 0)
  } else {
    laststate.value = true
  }
  state.value = true
}

const handleKeyup = (event: KeyboardEvent) => {
  if (!state.value || props.keyCode !== event.keyCode) return
  // Esc (27) fires callback on keyup only
  if (props.keyCode === 27) props.callback?.(props.keyCode, false)
  state.value = false
}

const onClick = () => {
  props.click?.()
  if (!props.nonactive) props.callback?.(props.keyCode ?? 0, true)
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('keyup', handleKeyup)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('keyup', handleKeyup)
})
</script>

<template>
  <div
    ref="buttonEl"
    :class="[
      'KeyAnimation',
      classData,
      {
        active: laststate,
        keyDetector,
        keyDonate,
        pressed: state,
        disabled,
        nonactive,
      },
    ]"
    :style="style"
    @click="onClick"
  >
    <slot />
  </div>
</template>
