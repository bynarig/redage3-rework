<script setup lang="ts">
import { translateText } from 'lang'
import { executeClient } from 'api/rage'
import { onMounted, onBeforeUnmount } from 'vue'

const handleKeyUp = (event: KeyboardEvent) => {
  const { keyCode } = event
  if (keyCode === 27) executeClient('client:OnDialogCallback', false)
  else if (keyCode === 13) executeClient('client:OnDialogCallback', true)
}

onMounted(() => window.addEventListener('keyup', handleKeyUp))
onBeforeUnmount(() => window.removeEventListener('keyup', handleKeyUp))
</script>

<template>
  <div id="popup__newhud_upgrade">
    <div class="popup__newhud_box">
      <div class="popup__newhud_title">
        <span class="hud__icon-inventory popup__newhud_icon" /> {{ translateText('popups', 'Улучшения') }}
      </div>
      <div class="popup__newhud_grid">
        <div v-for="index in 15" :key="index" class="popup__grid_element">
          <div class="popup__grid_image">
            <div>{{ translateText('popups', 'Мастерская') }}</div>
          </div>
          <div class="box-between w-100">
            <div class="gray">150000$</div>
            <div class="popup__grid_button">{{ translateText('popups', 'Купить') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
