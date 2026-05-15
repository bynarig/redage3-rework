<script setup lang="ts">
import './assets/css/iconscircle.css'
import './assets/css/circle.scss'
import { executeClient } from 'api/rage'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

// TODO: migrate store/keys (keys) to Pinia — was $keys[31] in Svelte

interface CircleItem {
  func: string
  index: number
  name: string
}

const props = defineProps<{
  popupData: string | CircleItem[]
}>()

const data = ref<CircleItem[]>(
  typeof props.popupData === 'string' ? JSON.parse(props.popupData) : props.popupData
)

watch(
  () => props.popupData,
  (val) => {
    data.value = typeof val === 'string' ? JSON.parse(val) : val
  }
)

const prefix = 'circle-'
const drawname = ref('Назад')

const onHovered = (name: string, isBack = false) => {
  drawname.value = name
  executeClient('client.circle.isBack', isBack)
}

const onCircleClick = (func: string, index = 0) => {
  executeClient('client.circle.select', func, index)
}

const ontest = (index: number, max: number): number => {
  switch (max) {
    case 1: return 1
    case 2:
      if (index === 0) return 1
      if (index === 1) return 5
      break
    case 3:
      if (index === 0) return 1
      if (index === 1) return 3
      if (index === 2) return 5
      break
    case 4:
      if (index === 0) return 1
      if (index === 1) return 3
      if (index === 2) return 5
      if (index === 3) return 7
      break
    case 5:
      if (index === 0) return 1
      if (index === 1) return 2
      if (index === 2) return 4
      if (index === 3) return 6
      if (index === 4) return 8
      break
    case 6:
      if (index === 0) return 1
      if (index === 1) return 2
      if (index === 2) return 4
      if (index === 3) return 5
      if (index === 4) return 6
      if (index === 5) return 8
      break
  }
  return index + 1
}

const defaultCircleCloseWidth = 280
const defaultCircleCloseHeight = 280

const circleCloseEl = ref<HTMLElement | null>(null)

const initCircle = (node: HTMLElement) => {
  const rect = node.getBoundingClientRect()
  if (rect) {
    const percentWidth = (rect.width * 100 / defaultCircleCloseWidth) / 100
    const percentHeight = (rect.height * 100 / defaultCircleCloseHeight) / 100
    executeClient('client.circle.initCircle', percentWidth, percentHeight)
  }
}

const handleKeyUp = (event: KeyboardEvent) => {
  const { keyCode } = event
  for (let i = 0; i < 8; i++) {
    if (49 + i === keyCode) {
      const item = data.value[i]
      if (item) onCircleClick(item.func, item.index)
      return
    }
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const { keyCode } = event
  // TODO: replace with Pinia keys store — was $keys[31]
  const keysStore = (window as any).keys ?? []
  if (keyCode === keysStore[31]) onCircleClick('back')
}

const handleMouseUp = (event: MouseEvent) => {
  if (event.which === 3) onCircleClick('back')
}

const updateCategory = (json: string) => {
  data.value = JSON.parse(json)
}

onMounted(() => {
  if (circleCloseEl.value) initCircle(circleCloseEl.value)
  window.addEventListener('keyup', handleKeyUp)
  window.addEventListener('keydown', handleKeyDown)
  window.addEventListener('mouseup', handleMouseUp)
  ;(window as any).events?.addEvent('cef.circle.updateCategory', updateCategory)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', handleKeyUp)
  window.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('mouseup', handleMouseUp)
  ;(window as any).events?.removeEvent('cef.circle.updateCategory', updateCategory)
})
</script>

<template>
  <div class="circle">
    <div
      ref="circleCloseEl"
      class="circle__close"
      @mouseenter="onHovered('Назад', true)"
      @mouseleave="onHovered('Назад')"
      @click="onCircleClick('back')"
    >
      <div class="box-column">
        <div class="circle__image" :class="{ active: drawname !== 'Назад' }"></div>
        <div class="circle__text">{{ drawname }}</div>
      </div>
    </div>
    <div class="center">
      <li
        v-for="(item, index) in data"
        :key="index"
        :class="`contents child${ontest(index, data.length)}`"
        @click="onCircleClick(item.func, item.index)"
        @mouseenter="onHovered(item.name)"
        @mouseleave="onHovered('Назад')"
      >
        <span :class="`icons-circle ${prefix}${item.func}`" />
        <div>{{ item.name }}</div>
        <div class="contents__index">{{ index + 1 }}</div>
      </li>
    </div>
  </div>
</template>
