<script setup lang="ts">
import { translateText } from 'lang'
import { executeClient } from 'api/rage'
import './main.scss'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// TODO: migrate store/account (accountLogin), store/server (serverDonatMultiplier, serverId) to Pinia

const props = defineProps<{
  popupData?: number
}>()

const donateUrl = ref(false)
const donateToggled = ref(true)
const donateText = ref('1')

const onHandleInput = (value: string) => {
  let num = Math.round(Number(value.replace(/\D+/g, '')))
  if (num < 1) num = 1
  else if (num > 999999) num = 999999
  donateText.value = String(num)
}

const getDonate = (text: string | number) => {
  let val = Number(text)
  if (val < 0) val = 0
  else if (val > 999999) val = 999999
  // TODO: replace with Pinia serverDonatMultiplier store
  const serverDonatMultiplier = (window as any).serverDonatMultiplier ?? 1
  let tallage = 0
  if (serverDonatMultiplier > 1) {
    val = val * serverDonatMultiplier
  } else {
    if (val >= 20000) tallage = 50
    else if (val >= 10000) tallage = 30
    else if (val >= 3000) tallage = 20
    else if (val >= 1000) tallage = 10
  }
  return `${Math.round(val) + Math.round((val / 100) * tallage)}`
}

const onDonate = () => {
  donateToggled.value = false
  // TODO: restore axios payment flow once store/account and store/server are migrated to Pinia
  // original used: axios.post with accountLogin, donateText, serverId
}

if (props.popupData && props.popupData > 0) {
  donateText.value = String(props.popupData)
  donateToggled.value = false
  onDonate()
}

const onKeyDown = (event: KeyboardEvent) => {
  if (!donateUrl.value) return
  if (event.which === 27) {
    ;(window as any).router?.setPopUp?.('')
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <template v-if="donateUrl">
    <!--<iframe sandbox="allow-same-origin allow-forms allow-scripts" :src="donateUrl" scrolling="auto" frameborder="0" class="donate-iframe" title="" />-->
    <div class="donate-close" @click="(window as any).router?.setPopUp?.('')">X</div>
  </template>
  <div v-if="donateToggled" id="donatepopup">
    <div class="donatepopup__back"></div>
    <template v-if="false">
      <div class="donatepopup__main">
        <div class="popup__title">{{ translateText('popups', 'Пополнение счета') }}</div>
        <div class="popup__subtitle">{{ translateText('popups', 'Пополняйте RB-счёт прямо из игры!  За RedBucks можно сменить ник, снять варн, купить премиум-одежду, покрутить кейсов, купить подписку, вип-статус, обменять на игровую валюту и сделать еще много всего интересного. Спасибо тебе!') }}</div>
        <input type="text" class="popup__input" placeholder="Введите сумму" :value="donateText" @input="onHandleInput(($event.target as HTMLInputElement).value)" />
        <div class="popup__input">{{ translateText('popups', 'Вы получите') }} {{ getDonate(donateText) }} RB</div>
        <div class="box-between">
          <div class="popup__button big orange" @click="onDonate">{{ translateText('popups', 'Пополнить счет') }}</div>
          <div class="popup__button" @click="(window as any).router?.setPopUp?.('')">{{ translateText('popups', 'Назад') }}</div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="donatepopup__payments">
        <div class="box-between">
          <div class="box-column">
            <div class="donatepopup__nickname">Sokolyansky</div>
            <div class="donatepopup__small">{{ translateText('popups', 'Пополнение счета') }}</div>
            <div class="donatepopup__count">200<span class="red"> RB</span></div>
            <div class="donatepopup__button"><span class="gray">{{ translateText('popups', 'К оплате') }}:</span>20000 {{ translateText('popups', 'руб') }}.</div>
          </div>
          <div class="donatepopup__logo"></div>
        </div>
        <div class="donatepopup__payments_title">{{ translateText('popups', 'Выберите способ оплаты') }}</div>
        <div class="donatepopup__grid">
          <div class="donatepopup__element">
            <div class="donatepopup__element_img" :style="`background-image: url('${(document as any).cloud}img/roulette/items_5.png')`"></div>
          </div>
          <div class="donatepopup__element">
            <div class="donatepopup__element_img" :style="`background-image: url('${(document as any).cloud}img/roulette/items_0.png')`"></div>
          </div>
        </div>
        <div class="box-between popup__button_box">
          <div class="popup__button big orange" @click="onDonate">{{ translateText('popups', 'Подтвердить') }}</div>
          <div class="popup__button" @click="(window as any).router?.setPopUp?.('')">{{ translateText('popups', 'Назад') }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
