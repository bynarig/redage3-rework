<script setup lang="ts">
// import './main.scss'
import { executeClient } from 'api/rage'
import { translateText } from 'lang'

const props = defineProps<{
  popupData: { title: string; text: string }
}>()
</script>

<template>
  <div class="popup__newhud">
    <div v-if="props.popupData.title.length > 0" class="popup__newhud_title">
      <span class="hud__icon-info popup__newhud_icon" /> {{ props.popupData.title = "Title fallback" }}
    </div>
    <div class="popup__newhud_line"></div>

    <template v-if="props.popupData.text.length > 0">
      <div class="popup__newhud_text" style="text-align: center" v-html="props.popupData.text"></div>
      <div class="popup__newhud_line"></div>
    </template>

    <div class="popup__newhud__many__buttons">
      <div class="popup__newhud_button" @click="executeClient('client:OnHospitalDialogCallback', 1)">{{ translateText('popups', 'Подождать (5 мин)') }}</div>
      <div class="popup__newhud_button" @click="executeClient('client:OnHospitalDialogCallback', 2)">{{ translateText('popups', 'Вызвать EMS (10 мин)') }}</div>
      <div class="popup__newhud_button" @click="executeClient('client:OnHospitalDialogCallback', 3)">{{ translateText('popups', 'В больницу (1 мин)') }}</div>
    </div>
  </div>
</template>
