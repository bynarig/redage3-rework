<script setup lang="ts">
import { translateText } from 'lang'
import { executeClient } from 'api/rage'
import './main.scss'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  popupData: { title: string; elements: string | [string, string][] }
}>()

const elements = ref<[string, string][]>(
  typeof props.popupData.elements === 'string'
    ? JSON.parse(props.popupData.elements)
    : props.popupData.elements
)

watch(
  () => props.popupData.elements,
  (val) => {
    if (val && typeof val === 'string') elements.value = JSON.parse(val)
  }
)

const listId = ref(0)

const handleKeyUp = (event: KeyboardEvent) => {
  const { keyCode } = event
  switch (keyCode) {
    case 13:
      onSelected(elements.value[listId.value][1])
      break
    case 38:
      if (--listId.value < 0) listId.value = elements.value.length - 1
      break
    case 40:
      if (++listId.value >= elements.value.length) listId.value = 0
      break
    case 27:
      onSelected('null')
      break
  }
}

const onSelected = (listItem: string) => {
  executeClient('popup.list.selected', listItem)
}

onMounted(() => window.addEventListener('keyup', handleKeyUp))
onBeforeUnmount(() => window.removeEventListener('keyup', handleKeyUp))
</script>

<template>
  <div class="popup__newhud_boxinput">
    <div class="popup__newhud_esc">
      <div class="popup__newhud_escbutton box-center">ESC</div>
      <div>{{ translateText('popups', 'Закрыть') }}</div>
    </div>
    <div class="popup__newhud_box">
      <div class="popup__newhud_title">
        <span class="hud__icon-info popup__newhud_icon" /> {{ props.popupData.title }}
      </div>
      <div class="popup__select_elements">
        <div
          v-for="(item, index) in elements"
          :key="index"
          class="popup__select_element"
          :class="{ active: listId === index }"
          @click="onSelected(item[1])"
        >
          {{ item[0] }}
        </div>
      </div>
      <div class="popup__newhud__buttons">
        <div class="popup__newhud_button" @click="onSelected('null')">{{ translateText('popups', 'Отмена') }}</div>
      </div>
    </div>
  </div>
</template>
