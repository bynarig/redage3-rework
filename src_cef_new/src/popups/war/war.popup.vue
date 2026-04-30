<script setup lang="ts">
import { executeClient } from 'api/rage'
import './main.scss'
import { ref, watch } from 'vue'

import { typeBattle, composition, weaponsCategory } from './data'

interface WarData {
  maps: string[]
  title: string
  owner: string
  minHour: number
}

const props = defineProps<{
  popupData?: string | WarData
}>()

const data = ref<WarData>(
  typeof props.popupData === 'string'
    ? JSON.parse(props.popupData)
    : (props.popupData ?? { maps: ['Домбас'], title: '', owner: '', minHour: 14 })
)

watch(
  () => props.popupData,
  (val) => {
    if (val && typeof val === 'string') data.value = JSON.parse(val)
    else if (val) data.value = val as WarData
  }
)

const selectTypeBattle = ref(0)
const onSelectTypeBattle = (count: number) => {
  let value = selectTypeBattle.value + count
  if (value < 0) value = typeBattle.length - 1
  else if (value >= typeBattle.length) value = 0
  selectTypeBattle.value = value
}

const selectComposition = ref(0)
const onSelectComposition = (count: number) => {
  let value = selectComposition.value + count
  if (value < 0) value = composition.length - 1
  else if (value >= composition.length) value = 0
  selectComposition.value = value
}

const selectWeaponsCategory = ref(0)
const onSelectWeaponsCategory = (count: number) => {
  let value = selectWeaponsCategory.value + count
  if (value < 0) value = weaponsCategory.length - 1
  else if (value >= weaponsCategory.length) value = 0
  selectWeaponsCategory.value = value
}

const selectMap = ref(0)
const onSelectMap = (count: number) => {
  let value = selectMap.value + count
  if (value < 0) value = data.value.maps.length - 1
  else if (value >= data.value.maps.length) value = 0
  selectMap.value = value
}

const days = ['Сегодня', 'Завтра']
const selectDay = ref(0)
const onSelectDay = (count: number) => {
  let value = selectDay.value + count
  if (value < 0) value = days.length - 1
  else if (value >= days.length) value = 0
  selectDay.value = value
}

const mins = [0, 15, 30, 45]
const selectMin = ref(0)
const onSelectMin = (count: number) => {
  let value = selectMin.value + count
  if (value < 0) value = mins.length - 1
  else if (value >= mins.length) value = 0
  selectMin.value = value
}

const minHour = 14
const maxHour = 23
const selectHour = ref(minHour)
const onSelectHour = (count: number) => {
  let value = selectHour.value + count
  if (selectDay.value === 0) {
    if (minHour > value) value = maxHour
    else if (value > maxHour) value = data.value.minHour
  } else {
    if (minHour > value) value = maxHour
    else if (value > maxHour) value = minHour
  }
  selectHour.value = value
}

const onClose = () => executeClient('client.closeWar')
const onWar = () =>
  executeClient(
    'client.war',
    selectTypeBattle.value,
    selectComposition.value,
    selectWeaponsCategory.value,
    selectDay.value,
    selectHour.value,
    mins[selectMin.value]
  )
</script>

<template>
  <div class="popup__war">
    <div class="box-column">
      <div class="box-flex">
        <div class="fractionsicon-squads popup__war_icon"></div>
        <div class="box-column">
          <div class="popup__war_title">Объявление войны</div>
          <div class="popup__war_subtitle">Выберите параметры и начните захват</div>
        </div>
      </div>
      <div class="popup__war_smalltitle mt-40">{{ data.title }}</div>
      <div class="popup__war_subtitle">Название объекта</div>
      <div class="popup__war_smalltitle">{{ data.owner }}</div>
      <div class="popup__war_subtitle">Владелец</div>
    </div>
    <div class="box-column">
      <div class="box-between mb-23">
        <div class="box-flex">
          <div class="fractionsicon-settings popup__war_iconsmall"></div>
          <div class="box-column">
            <div class="popup__war_headtitle">Настройка войны за бизнес</div>
            <div class="popup__war_headsubtitle">Здесь вы можете настроить все параметры войны за бизнес</div>
          </div>
        </div>
        <div class="popup__war_smallbutton" @click="onClose">Назад</div>
      </div>
      <div class="popup__war_element">
        <div class="box-column">
          <div class="popup__element_title">Тип битвы</div>
          <div class="popup__element_subtitle">Выберите нужный тип битвы</div>
        </div>
        <div class="popup__war_selector">
          <div class="popup__element_button" @click="onSelectTypeBattle(-1)">&lt;</div>
          <div>{{ typeBattle[selectTypeBattle] }}</div>
          <div class="popup__element_button" @click="onSelectTypeBattle(1)">&gt;</div>
        </div>
      </div>
      <div class="popup__war_element">
        <div class="box-column">
          <div class="popup__element_title">Состав участников битвы</div>
          <div class="popup__element_subtitle">Выберите подходящее количество</div>
        </div>
        <div class="popup__war_selector">
          <div class="popup__element_button" @click="onSelectComposition(-1)">&lt;</div>
          <div>{{ composition[selectComposition] }}</div>
          <div class="popup__element_button" @click="onSelectComposition(1)">&gt;</div>
        </div>
      </div>
      <div class="popup__war_element">
        <div class="box-column">
          <div class="popup__element_title">Тип оружия</div>
          <div class="popup__element_subtitle">Выберите нужный тип оружия</div>
        </div>
        <div class="popup__war_selector">
          <div class="popup__element_button" @click="onSelectWeaponsCategory(-1)">&lt;</div>
          <div>{{ weaponsCategory[selectWeaponsCategory] }}</div>
          <div class="popup__element_button" @click="onSelectWeaponsCategory(1)">&gt;</div>
        </div>
      </div>
      <!--<div class="popup__war_element">
        <div class="box-column">
          <div class="popup__element_title">Место проведения битвы</div>
          <div class="popup__element_subtitle">Выберите место для войны за объект</div>
        </div>
        <div class="popup__war_selector">
          <div class="popup__element_button" @click="onSelectMap(-1)">&lt;</div>
          <div>{{ data.maps[selectMap] }}</div>
          <div class="popup__element_button" @click="onSelectMap(1)">&gt;</div>
        </div>
      </div>-->
      <div class="popup__war_element">
        <div class="box-column">
          <div class="popup__element_title">Дата проведения битвы</div>
          <div class="popup__element_subtitle">Выберите дату проведения войны за территорию</div>
        </div>
        <div class="popup__war_selector w-340">
          <!--<div class="popup__war_small">дд/мм/чч</div>-->
          <div class="box-flex">
            <div class="popup__war_left" @click="onSelectDay(-1)">&lt;</div>
            <div class="popup__war_date">{{ days[selectDay] }}</div>
            <div class="popup__war_right mr-10" @click="onSelectDay(1)">&gt;</div>
            <div class="popup__war_left" @click="onSelectHour(-1)">&lt;</div>
            <div class="popup__war_date">{{ selectHour }}</div>
            <div class="popup__war_right mr-10" @click="onSelectHour(1)">&gt;</div>
            <div class="popup__war_left" @click="onSelectMin(-1)">&lt;</div>
            <div class="popup__war_date">{{ mins[selectMin] }}</div>
            <div class="popup__war_right" @click="onSelectMin(1)">&gt;</div>
          </div>
        </div>
      </div>
      <div class="popup__war_button" @click="onWar">Забить войну</div>
    </div>
    <div class="popup__war_image"></div>
  </div>
</template>
