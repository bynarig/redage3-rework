<script setup lang="ts">
import './main.scss'
import { executeClient } from 'api/rage'
import { translateText } from 'lang'

const props = defineProps<{
  popupData: { title: string; text: string }
}>()

// keyboard handler is commented out in original, keeping it inactive
</script>

<template>
  <div id="popup__death">
    <!--     <div class="popup__death_timer">11:26</div> -->
    <div class="popup__death_title">{{ translateText('popups', 'Вы без сознания') }}</div>
    <div class="popup__death_subtitle" v-html="props.popupData.text"></div>
    <div class="popup__death__buttons">
      <div class="popup__death_button" @click="executeClient('client:OnHospitalDialogCallback', 1)">{{ translateText('popups', 'Подождать (5 мин)') }}</div>
      <div class="popup__death_button" @click="executeClient('client:OnHospitalDialogCallback', 2)">{{ translateText('popups', 'Вызвать EMS (10 мин)') }}</div>
      <div class="popup__death_button" @click="executeClient('client:OnHospitalDialogCallback', 3)">{{ translateText('popups', 'В больницу (1 мин)') }}</div>
    </div>
    <span class="hud__icon-skull popup__death_icon" />
  </div>
</template>
