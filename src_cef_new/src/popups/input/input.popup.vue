<script setup lang="ts">
import { translateText } from 'lang'
import { executeClient } from 'api/rage'
import './main.scss'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  popupData: { title: string; plholder: string; length: number }
}>()

const input = ref('')

const onSend = () => {
  executeClient('input', input.value)
  input.value = ''
}

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.keyCode === 13) onSend()
}

onMounted(() => window.addEventListener('keyup', handleKeyUp))
onBeforeUnmount(() => window.removeEventListener('keyup', handleKeyUp))
</script>

<template>
  <div class="popup__newhud_boxinput">
    <!--<div class="popup__newhud_esc">
        <div class="popup__newhud_escbutton box-center">ESC</div>
        <div>Закрыть</div>
    </div>-->
    <div class="popup__newhud_box">
      <div class="popup__newhud_title">
        <span class="hud__icon-info popup__newhud_icon" /> {{ props.popupData.title }}
      </div>
      <!--<div class="popup__newhud_subtitle">
          {{ props.popupData.title }}
      </div>-->
      <input class="popup__newhud_input" :placeholder="props.popupData.plholder" :maxlength="props.popupData.length" v-model="input" />
      <div class="popup__newhud__buttons">
        <div class="popup__newhud_button" @click="onSend">{{ translateText('popups', 'Подтвердить') }}</div>
      </div>
    </div>
  </div>
</template>
