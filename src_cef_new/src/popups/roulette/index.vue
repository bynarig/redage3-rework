<script setup lang="ts">
import { translateText } from 'lang'
import { executeClient, executeClientAsync } from 'api/rage'
import { addListernEvent } from 'api/functions'
import './main.scss'
import { ref, watch, onBeforeUnmount } from 'vue'

import PoputWin from './popupprise.vue'

interface RouletteItem {
  color: string
  image: string
  title: string
}

interface WinBlock {
  Index: number
  ItemIndex: number
  IndexList: number
  Price?: number
  Text?: string
  Item?: unknown
}

interface CaseBlock {
  randomBlocks: RouletteItem[]
  startRandomBlocks: RouletteItem[]
  winBlock: WinBlock | Record<string, never>
  carousel: number
  carouselStart: number
  fixСarousel: boolean
  IntervalId: ReturnType<typeof setInterval> | null
}

interface CaseData {
  name: string
  index: number
  price: number
  items: RouletteItem[]
}

const props = defineProps<{
  popupData: number
}>()

const caseData = ref<CaseData>({} as CaseData)
const isLoad = ref(false)
const maxCount = 8

const getRndInteger = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

const getRouletteData = (): CaseBlock[] => {
  const result: CaseBlock[] = []
  for (let i = 0; i < maxCount; i++) {
    const newItems: RouletteItem[] = []
    const sCase = caseData.value.items
    for (let j = 0; j < 50; j++) {
      newItems.push(sCase[getRndInteger(0, sCase.length - 1)])
    }
    result.push({
      randomBlocks: newItems,
      startRandomBlocks: newItems.slice(0, 9),
      winBlock: {},
      carousel: 0,
      carouselStart: 0,
      fixСarousel: true,
      IntervalId: null,
    })
  }
  return result
}

const getData = () => {
  executeClientAsync('donate.roulette.getCaseOne').then((result: unknown) => {
    if (result && typeof result === 'string') {
      caseData.value = JSON.parse(result)
      selectCaseToItems.value = caseData.value.items
      casesData.value = getRouletteData()
      isLoad.value = true
    }
  })
}

executeClient('client.donate.roulette.loadCase', props.popupData)
addListernEvent('donate.roulette.initCase', getData)

const dataPopup = ref<CaseBlock[] | null>(null)
const isPopup = ref(false)

const setPopup = (toggled = false, data: CaseBlock[] | null = null) => {
  dataPopup.value = data
  isPopup.value = toggled
}

let antiFlud = 0
let casesData = ref<CaseBlock[]>([])
let toggledFast = false
let selectCaseToItems = ref<RouletteItem[]>([])
const currentCount = ref(1)
const isConfirm = ref(false)

const isEndPopup = ref(isPopup.value)
watch(isPopup, (val) => {
  if (val !== isEndPopup.value) {
    isEndPopup.value = val
    if (!val && isConfirm.value) {
      for (let i = 0; i < maxCount; i++) {
        casesData.value[i].winBlock = {}
      }
      isConfirm.value = false
    }
  }
})

const openPopup = () => {
  let stillRunning = false
  casesData.value.forEach((caseItem) => {
    if (!caseItem.fixСarousel && caseItem.winBlock && (caseItem.winBlock as WinBlock).Item) {
      stillRunning = true
    }
  })
  if (!stillRunning) setPopup(true, casesData.value)
}

const confirm = (data: { Index: number; ItemIndex: number; IndexList: number; Price?: number; Text?: string }[]) => {
  if (isConfirm.value) return
  isConfirm.value = true

  data.forEach((caseItem, caseindex) => {
    const elemWidth = document.querySelector<HTMLElement>(
      `#popuponate__roulette .newdonate__roulette-main:nth-child(${caseindex + 1}) .newdonate__roulette-element:first-child`
    )
    let newItems = casesData.value[caseindex].startRandomBlocks.slice()

    for (let index = newItems.length; index < 50; index++) {
      if (index === caseItem.Index) {
        newItems.push(selectCaseToItems.value[caseItem.ItemIndex])
      } else {
        newItems.push(selectCaseToItems.value[getRndInteger(0, selectCaseToItems.value.length - 1)])
      }
    }

    const randomCarousel = Math.round(
      getRndInteger(
        0 - (elemWidth?.clientWidth ?? 0) / 2 + 10,
        (elemWidth?.clientWidth ?? 0) / 2
      ) - 10
    )

    casesData.value[caseindex] = {
      fixСarousel: false,
      winBlock: caseItem,
      randomBlocks: newItems,
      startRandomBlocks: newItems.slice(caseItem.Index - 3, caseItem.Index + 6),
      carouselStart: randomCarousel,
      carousel: 0,
      IntervalId: null,
    }

    setTimeout(() => {
      const first = document.querySelector<HTMLElement>(
        `#popuponate__roulette .newdonate__roulette-main:nth-child(${caseindex + 1}) .newdonate__roulette-element:nth-child(4)`
      )
      const realCarousel = document.querySelector<HTMLElement>(
        `#popuponate__roulette .newdonate__roulette-main:nth-child(${caseindex + 1}) .newdonate__roulette-element:nth-child(${caseItem.Index + 1})`
      )

      if (first && realCarousel) {
        casesData.value[caseindex].carousel =
          realCarousel.getBoundingClientRect().x - first.getBoundingClientRect().x + randomCarousel
      }

      if (!toggledFast) {
        let stopToCord = -1
        casesData.value[caseindex].IntervalId = setInterval(() => {
          const left = elemWidth?.getBoundingClientRect().left ?? -1
          if (stopToCord === left) {
            clearInterval(casesData.value[caseindex].IntervalId!)
            casesData.value[caseindex].IntervalId = null
            casesData.value[caseindex].fixСarousel = true
            openPopup()
          } else {
            stopToCord = left
          }
        }, 500)
      } else {
        casesData.value[caseindex].fixСarousel = true
        openPopup()
      }
    }, 0)
  })
}

;(window as any).events?.addEvent('cef.roullete.confirm', confirm)

onBeforeUnmount(() => {
  for (let i = 0; i < maxCount; i++) {
    if (casesData.value[i]?.IntervalId !== null) {
      clearInterval(casesData.value[i].IntervalId!)
      casesData.value[i].IntervalId = null
    }
  }
  ;(window as any).events?.removeEvent('cef.roullete.confirm', confirm)
  executeClient('client.roullete.confirm', false, -1)
})

const onOpen = (_toggledFast = false) => {
  if (isConfirm.value) return
  if (antiFlud > new Date().getTime()) return
  antiFlud = new Date().getTime() + 2500
  toggledFast = _toggledFast
  executeClient('client.roullete.open', caseData.value.index, currentCount.value)
}

const onCurrentCount = (count: number) => {
  if (isConfirm.value) return
  if (antiFlud > new Date().getTime()) return
  currentCount.value = count
}

const getPrice = (price: number, index: number, unique?: string) => {
  if (unique) {
    const getData = unique.split('_')
    if (getData[0] === 'cases' && Number(getData[1]) === index && Number(getData[2]) === 0) {
      price = Math.round(price * 0.7)
    }
  }
  return price
}
</script>

<template>
  <div v-if="isLoad" id="popuponate__roulette">
    <div v-if="isPopup" id="newdonate__popup" class="active">
      <PoputWin :set-popup="setPopup" :popup-data="dataPopup!" />
    </div>

    <div class="newdonate__header">{{ caseData.name }}</div>
    <div class="newdonate__roulette-title">{{ translateText('popups', 'Количество прокрутов') }}</div>
    <div class="newdonate__roulette-count">
      <div class="newdonate__roulette-circle" :class="{ active: currentCount === 1 }" @click="onCurrentCount(1)">1</div>
      <div class="newdonate__roulette-circle" :class="{ active: currentCount === 2 }" @click="onCurrentCount(2)">2</div>
      <div class="newdonate__roulette-circle" :class="{ active: currentCount === 3 }" @click="onCurrentCount(3)">3</div>
      <div class="newdonate__roulette-circle" :class="{ active: currentCount === 5 }" @click="onCurrentCount(5)">5</div>
      <div class="newdonate__roulette-circle" :class="{ active: currentCount === maxCount }" @click="onCurrentCount(maxCount)">{{ maxCount }}</div>
    </div>
    <div class="newdonate__roulette-container">
      <template v-for="(caseBlock, indexCase) in casesData" :key="indexCase">
        <div v-if="currentCount > indexCase" class="newdonate__roulette-main">
          <div class="newdonate__roulette-main-line" />
          <div
            class="newdonate__roulette-elements"
            :style="`transition: ${caseBlock.fixСarousel ? 'none' : 'all 10000ms cubic-bezier(0.32, 0.64, 0.45, 1) 0s'};transform: translate3d(${caseBlock.fixСarousel ? 0 - caseBlock.carouselStart : 0 - caseBlock.carousel}px, 0px, 0px)`"
          >
            <div
              v-for="(item, index) in (caseBlock.fixСarousel ? caseBlock.startRandomBlocks : caseBlock.randomBlocks)"
              :key="index"
              :class="`newdonate__roulette-element margin-22 ${item.color}`"
              :tooltip="item.title"
            >
              <div class="roulette-element__img" :style="`background-image: url(${(document as any).cloud + 'img/roulette/' + item.image + '.png'})`" />
            </div>
          </div>
        </div>
      </template>
      <div class="newdonate__roulette-buttons">
        <div class="newdonate__button_small" @click="onOpen()">
          <div class="newdonate__button-text">{{ translateText('popups', 'Крутить') }}</div>
        </div>
        <div class="newdonate__button_small yellow" @click="onOpen(true)">
          <div class="newdonate__button-text">{{ translateText('popups', 'Быстро') }}</div>
        </div>
        <div class="newdonate__button_small" @click="(window as any).router?.setPopUp?.('')">
          <div class="newdonate__button-text">{{ translateText('popups', 'Закрыть') }}</div>
        </div>
      </div>
      <div class="newdonate__roulette-info">
        {{ translateText('popups', 'Что есть в кейсе') }}?
      </div>
      <div class="newdonate__roulette-items">
        <div
          v-for="(value, index) in caseData.items"
          :key="index"
          :class="`newdonate__roulette-element ${value.color}`"
          :tooltip="value.title"
        >
          <div class="roulette-element__img" :style="`background-image: url(${(document as any).cloud + 'img/roulette/' + value.image + '.png'})`" />
        </div>
      </div>
    </div>
  </div>
</template>
