<script setup lang="ts">
import { executeClient } from 'api/rage'
import { translateText } from 'lang'
import './main.scss'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// TODO: migrate store/server (serverDonatMultiplier) and store/account (accountLogin, serverId) to Pinia

const props = defineProps<{
  popupData?: { id: number; title: string; data: [number, number] }
}>()

const data = ref(props.popupData ?? { id: 0, title: 'Покупка випр', data: [1000, 100] as [number, number] })

const selectType = ref(0)

const getPrice = (price: number, type: number) => {
  if (type === 1) return price
  // TODO: replace with Pinia serverDonatMultiplier store
  const serverDonatMultiplier = (window as any).serverDonatMultiplier ?? 1
  return Math.floor(price / serverDonatMultiplier)
}

const onDonate = () => {
  if (!selectType.value) {
    executeClient('client.donatepack.rb', data.value.id)
    executeClient('client.donatepack.close')
  } else {
    ;(window as any).notificationAdd?.(
      4,
      9,
      `Вы начали процесс покупки Battle Pass. Совершите донат через личный кабинет (lk.redage.net) в размере 1999 руб, и премиум-доступ автоматически станет доступен.`,
      25000
    )
    executeClient('client.donatepack.donate', data.value.id)
    executeClient('client.donatepack.close')
  }
}

const cloud: string = (window as any).cloud ?? ''
const closePopUp = () => (window as any).router?.setPopUp?.('')

const onKeyDown = (event: KeyboardEvent) => {
  if (event.which === 27) {
    ;(window as any).router?.setPopUp?.('')
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <div id="donatepopup">
    <div class="donatepopup__back"></div>
    <div class="donatepopup__payments">
      <div class="box-between">
        <div class="box-column">
          <div class="donatepopup__nickname">{{ data.title }}</div>
          <div class="donatepopup__small">{{ !selectType ? 'Купить за RedBucks' : 'Купить за рубли' }}</div>
          <div class="donatepopup__count">{{ data.data[selectType] }}<span class="red"> {{ !selectType ? 'RB' : 'руб.' }}</span></div>
          <div class="donatepopup__button"><span class="gray">{{ !selectType ? 'В эквиваленте' : 'К оплате' }}: </span>{{ getPrice(data.data[selectType] ?? 0, selectType) }} {{ translateText('popups', 'руб') }}.</div>
        </div>
        <div class="donatepopup__logo"></div>
      </div>
      <div class="donatepopup__payments_title">{{ translateText('popups', 'Выберите способ оплаты') }}</div>
      <div class="donatepopup__grid">
        <div class="donatepopup__element" :class="{ active: selectType === 0 }" @click="selectType = 0">
          <div class="donatepopup__element_img" :style="`background-image: url('${cloud}img/roulette/items_5.png')`"></div>
        </div>
        <div class="donatepopup__element" :class="{ active: selectType === 1 }" @click="selectType = 1">
          <div class="donatepopup__element_label">{{ translateText('popups', 'Скидка') }} {{ 100 - Math.round(data.data[1] / getPrice(data.data[0] ?? 0, 0) * 100) }}%</div>
          <div class="donatepopup__element_img" :style="`background-image: url('${cloud}img/roulette/items_0.png')`"></div>
        </div>
      </div>
      <div class="box-between popup__button_box">
        <div class="popup__button big orange" @click="onDonate">{{ translateText('popups', 'Подтвердить') }}</div>
        <div class="popup__button" @click="closePopUp()">{{ translateText('popups', 'Назад') }}</div>
      </div>
      <div class="donatepopup__donate_info">
        <template v-if="selectType === 1">
          {{ translateText('popups', 'После нажатия кнопки "Подтвердить" у вас есть 5 минут, чтобы совершить платёж.') }}<br /><br />{{ translateText('popups', 'Если выйти из игры до завершения транзакции, то на аккаунт будут зачислены RedBucks по текущему курсу.') }}
        </template>
      </div>
    </div>
  </div>
</template>
