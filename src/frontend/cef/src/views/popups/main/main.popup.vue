<script setup lang="ts">
import { translateText } from 'lang'
import './main.scss'

const props = defineProps<{
  popupData: { Type: string; Title: string; Text: string }
}>()

const statuses = [
  {
    code: 'kick',
    status: 'Вас кикнули',
    text: 'Вас кикнул Администратор : Dmitriy Jaguar вы можете обжаловать кик на форуме проекта https://forum.redage.net/',
    button: 'Обжаловать',
  },
  {
    code: 'ban',
    status: 'Вы забанены',
    text: 'Вас забанил Администратор : Dmitrio Jaguarchik до 21.22.2019 причина: Вылил ягуар https://forum.redage.net/',
    button: 'Обжаловать',
  },
  {
    code: 'restart',
    status: 'Сервер на рестарте',
    text: 'В данный момент сервер на рестарте, ожадайте в течении 5 минут сервер запустится',
    button: 'Встать в очередь',
  },
]
const currentStatus = 0
</script>

<template>
  <div id="mainpopup" :class="props.popupData.Type">
    <div class="mainpopup__back hud__icon-warning"></div>
    <div :class="`mainpopup__main ${props.popupData.Type}`">
      <div class="mainpopup__smallback hud__icon-warning"></div>
      <div :class="`popup__title ${props.popupData.Type}`">{{ props.popupData.Title }}</div>
      <div class="popup__subtitle">{{ props.popupData.Text }}</div>
      <template v-if="false">
        <div class="box-between">
          <div :class="`popup__button big ${props.popupData.Type}`">{{ statuses[currentStatus]!.button }}</div>
          <div class="popup__button red">{{ translateText('popups', 'Назад') }}</div>
        </div>
      </template>
    </div>
  </div>
</template>
