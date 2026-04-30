<script setup lang="ts">
import './main.scss'
import { executeClient } from 'api/rage'
import { translateText } from 'lang'
import { onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  popupData: { title: string; text: string }
}>()

const handleKeyUp = (event: KeyboardEvent) => {
  const { keyCode } = event
  if (keyCode === 27) executeClient('client:OnDialogCallback', false)
  else if (keyCode === 13) executeClient('client:OnDialogCallback', true)
}

onMounted(() => window.addEventListener('keyup', handleKeyUp))
onBeforeUnmount(() => window.removeEventListener('keyup', handleKeyUp))
</script>

<template>
  <div class="popup__newhud">
    <div class="popup__newhud_box">
      <div v-if="props.popupData.title.length > 0" class="popup__newhud_title">
        <span class="hud__icon-info popup__newhud_icon" /> {{ props.popupData.title }}
      </div>
      <div v-if="props.popupData.text.length > 0" class="popup__newhud_text" v-html="props.popupData.text"></div>
      <!--<input class="popup__newhud_input" placeholder="Введите сумму которая нужна"/>-->
      <div class="popup__newhud__buttons">
        <div class="popup__newhud_button" @click="executeClient('client:OnDialogCallback', true)">{{ translateText('popups', 'Подтвердить') }}</div>
        <div class="popup__newhud_button" @click="executeClient('client:OnDialogCallback', false)">{{ translateText('popups', 'Отмена') }}</div>
      </div>
    </div>
  </div>
</template>
