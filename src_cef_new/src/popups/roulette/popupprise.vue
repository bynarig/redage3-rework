<script setup lang="ts">
import { translateText } from 'lang'
import { executeClient, executeClientAsync } from 'api/rage'
import { format } from 'api/formatter'
import { ref, onMounted } from 'vue'

interface WinBlock {
  Index: number
  ItemIndex: number
  IndexList: number
  Price?: number
  Text?: string
  Done?: boolean
}

interface CaseItem {
  popupData?: WinBlock
  Done?: boolean
  winBlock?: WinBlock | Record<string, never>
}

interface CaseData {
  items: { color: string; image: string; title: string }[]
}

const props = defineProps<{
  setPopup: (toggled?: boolean, data?: CaseItem[] | null) => void
  popupData: CaseItem[]
}>()

const caseData = ref<CaseData>({ items: [] })
const isLoad = ref(false)
const selectWin = ref(0)
const cloud: string = (window as any).cloud ?? ''

onMounted(() => {
  executeClientAsync('donate.roulette.getCaseOne').then((result: unknown) => {
    if (result && typeof result === 'string') {
      caseData.value = JSON.parse(result)
      isLoad.value = true
    }
  })
})

const closePopup = () => {
  let isDone = true
  props.popupData.forEach((item) => {
    if (!item.Done && item.winBlock && caseData.value.items[item.winBlock.ItemIndex]) isDone = false
  })
  if (isDone) props.setPopup()
}

const take = (index: number, indexList: number) => {
  if (indexList !== -1) {
    props.popupData[index]!.Done = true
    closePopup()
  } else {
    props.setPopup()
  }
  executeClient('client.roullete.confirm', false, indexList)
}

const sell = (index: number, indexList: number) => {
  if (indexList !== -1) {
    props.popupData[index]!.Done = true
    closePopup()
  } else {
    props.setPopup()
  }
  executeClient('client.roullete.confirm', true, indexList)
}

const onAllWinBlockPrice = (data: CaseItem[]) => {
  let price = 0
  data.forEach((item) => {
    if (!item.Done && item.winBlock && item.winBlock.Price) price += item.winBlock.Price
  })
  return price
}
</script>

<template>
  <div v-if="isLoad" class="newdonate__prise">
    <div class="newdonate__prise-block">
      <div class="newdonate__prise-title">{{ translateText('popups', 'Ты выбил из кейса') }}</div>
      <div class="newdonate__prise-elements">
        <template v-for="(item, index) in popupData" :key="index">
          <div
            v-if="!item.Done && item.winBlock && caseData.items[item.winBlock.ItemIndex]"
            class="newdonate__prise-main-element"
            @mouseenter="selectWin = index"
          >
            <div class="prise-main-buttons">
              <div
                v-if="item.winBlock.Price"
                class="prise-main-button-img sell-item-img"
                :tooltip="`Продать за: ${format('money', String((item.winBlock as WinBlock).Price))} RB`"
                @click="sell(index, (item.winBlock as WinBlock).IndexList)"
              />
              <div
                class="prise-main-button-img take-item-img"
                tooltip="Оставить предмет"
                @click="take(index, (item.winBlock as WinBlock).IndexList)"
              />
            </div>
            <div :class="`newdonate__prise-element ${(caseData.items[(item.winBlock as WinBlock).ItemIndex] as any)?.color}`">
              <div class="prise-img" :style="`background-image: url(${cloud + 'img/roulette/' + (caseData.items[(item.winBlock as WinBlock).ItemIndex] as any)?.image + '.png'})`" />
            </div>
          </div>
        </template>
      </div>
      <div class="newdonate__prise-rarity" v-html="(caseData.items[(popupData[selectWin]?.winBlock as WinBlock)?.ItemIndex] as any)?.title"></div>
      <div class="newdonate__prise-name" v-html="(popupData[selectWin]?.winBlock as WinBlock)?.Text"></div>
      <div class="newdonate__prise-buttons">
        <div v-if="onAllWinBlockPrice(popupData)" class="newdonate__button_small" @click="sell(0, -1)">
          <div class="newdonate__button-text">{{ translateText('popups', 'Продать всё за') }} {{ format('money', String(onAllWinBlockPrice(popupData))) }} RB</div>
        </div>
        <div class="newdonate__button_small yellow" @click="take(0, -1)">
          <div class="newdonate__button-text">{{ translateText('popups', 'Забрать все') }}</div>
        </div>
      </div>
    </div>
    <div class="newdonate__escape">
      <div class="box-flex">
        <span class="donateicons-esc" />
        <div class="newdonate__escape-title">ESC</div>
      </div>
      <div class="newdonate__escape-text">
        {{ translateText('popups', 'Нажми, чтобы закрыть') }}
      </div>
    </div>
  </div>
</template>
