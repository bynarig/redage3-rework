<script setup lang="ts">
import './assets/css/iconscircle.css'
import './assets/css/circle.scss'
import { executeClient } from 'api/rage'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// TODO: migrate store/chars (charFractionID, charOrganizationID) to Pinia
const charFractionID = ref(0)
const charOrganizationID = ref(0)

const props = defineProps<{
  popupData: { title: string; id: number }
}>()

const prefix = 'circle-'

const categoryData: Record<string, string[][]> = {
  Игрок: [['sell', 'offer', 'fraction', 'documents', 'heal', 'house', 'paired_animations', 'family']],
  Документы: [['passport', 'licenses', 'idcard', 'badge', 'lspdbadge', 'fibbadge']],
  Взаимодействия: [['handshake', 'tinter', 'givemoney', 'tradehouse', 'tradebiz', 'tradecar', 'vmuted' /*, 'whisper'*/]],
  'Парные анимации': [['embrace', 'kiss', 'paired_five', 'paired_slap', 'carry_0', 'carry_1', 'carry_2', 'carry_3']],
  Машина: [['hood', 'trunk', 'doors', 'carinv', 'trunkAction', 'ticketveh', 'breaking_trunk', 'veh_fix']],
  'Взаимодействие с багажником': [['intrunk', 'fromtrunk']],
  'В машине': [['belt', 'hood', 'trunk', 'doors', 'streetrace']],
  Недвижимость: [['sellcar', 'sellhouse', 'roommate', 'invitehouse']],
  Фракция: [
    [],
    ['leadaway', 'handsup', 'rob', 'robguns', 'pocket'],
    ['leadaway', 'handsup', 'rob', 'robguns', 'pocket'],
    ['leadaway', 'handsup', 'rob', 'robguns', 'pocket'],
    ['leadaway', 'handsup', 'rob', 'robguns', 'pocket'],
    ['leadaway', 'handsup', 'rob', 'robguns', 'pocket'],
    ['leadaway', 'search'],
    ['leadaway', 'search', 'takegun', 'takeillegal', 'takemask', 'ticket'],
    ['sellkit', 'offerheal'],
    ['leadaway', 'search', 'takegun', 'takeillegal', 'takemask'],
    ['leadaway', 'pocket', 'handsup', 'rob', 'robguns'],
    ['leadaway', 'pocket', 'handsup', 'rob', 'robguns'],
    ['leadaway', 'pocket', 'handsup', 'rob', 'robguns'],
    ['leadaway', 'pocket', 'handsup', 'rob', 'robguns'],
    ['leadaway', 'search', 'takegun'],
    [],
    ['leadaway', 'rob', 'robguns', 'pocket'],
    ['leadaway', 'search', 'pocket', 'takemask'],
    ['leadaway', 'search', 'takegun', 'takeillegal', 'takemask', 'ticket'],
  ],
  Семья: [['handsup', 'rob', 'robguns', 'pocket', 'leadaway']],
  Кальян: [['use_hookah', 'take_hookah']],
  'Лифт 1': [['f_lift_0', 'f_lift_1', 'f_lift_2', 'f_lift_3']],
  'Лифт 2': [['s_lift_0', 's_lift_1', 's_lift_2', 's_lift_3', 's_lift_4']],
  Лифт: [['c_lift_0', 'c_lift_1']],
  'Лифт правительства': [['gov_lift_1', 'gov_lift_3', 'gov_lift_4']],
  'Открыть планшет': [['fraction_table', 'org_table']],
  'Покинуть фракцию/семью': [['leave_fraction', 'leave_org']],
  Test: [['leave_fraction', 'leave_org', 'leave_org', 'leave_org', 'leave_org', 'leave_org', 'leave_org']],
}

const categoryDesc: Record<string, string> = {
  veh_fix: 'Починить транспорт',
  breaking_trunk: 'Взломать транспорт',
  belt: 'Ремень безопасности',
  sell: 'Взаимодействия',
  paired_animations: 'Парные анимации',
  whisper: 'Шептаться',
  intrunk: 'Залезть в багажник',
  trunkAction: 'Багажник',
  fromtrunk: 'Выкинуть из багажника',
  tradehouse: 'Обмен недвижимостью',
  tradebiz: 'Обмен бизнесами',
  tradecar: 'Обмен машинами',
  streetrace: 'Уличная гонка',
  handshake: 'Пожать руку',
  licenses: 'Показать лицензии',
  documents: 'Документы',
  idcard: 'Показать ID-карту',
  badge: 'Показать удостоверение',
  lspdbadge: 'Посмотреть значок',
  fibbadge: 'Посмотреть бейджик',
  carinv: 'Инвентарь',
  doors: 'Открыть/Закрыть двери',
  fraction: 'Фракция',
  family: 'Семья',
  offer: 'Предложить обмен',
  givemoney: 'Передать деньги',
  heal: 'Вылечить',
  hood: 'Открыть/Закрыть капот',
  leadaway: 'Вести за собой',
  offerheal: 'Предложить лечение',
  passport: 'Показать паспорт',
  search: 'Обыскать',
  sellkit: 'Продать аптечку',
  takegun: 'Изъять оружие',
  takeillegal: 'Изъять нелегал',
  trunk: 'Открыть/Закрыть багажник',
  pocket: 'Надеть/снять мешок',
  takemask: 'Сорвать маску/мешок',
  handsup: 'Заставить поднять руки',
  rob: 'Ограбить',
  robguns: 'Украсть оружие',
  house: 'Недвижимость',
  ticket: 'Выписать штраф',
  ticketveh: 'Выписать штраф',
  sellcar: 'Продать машину',
  sellhouse: 'Продать недвижимость',
  roommate: 'Заселить в дом',
  invitehouse: 'Пригласить в дом',
  embrace: 'Обнять',
  kiss: 'Поцеловать',
  paired_five: 'Дать пять',
  paired_slap: 'Дать пощечину',
  carry_0: 'Взять на руки',
  carry_1: 'Закинуть на шею',
  carry_2: 'Закинуть на плечо',
  carry_3: 'Взять в заложники',
  tinter: 'Повторить анимацию',
  use_hookah: 'Использовать кальян',
  take_hookah: 'Убрать кальян',
  f_lift_0: '0 этаж',
  f_lift_1: '1 этаж',
  f_lift_2: '2 этаж',
  f_lift_3: '3 этаж',
  s_lift_0: '0 этаж',
  s_lift_1: '1 этаж',
  s_lift_2: '2 этаж',
  s_lift_3: '3 этаж',
  s_lift_4: '4 этаж',
  c_lift_0: '1 этаж',
  c_lift_1: '2 этаж',
  gov_lift_1: '1 этаж',
  gov_lift_3: '3 этаж',
  gov_lift_4: '4 этаж',
  fraction_table: 'Планшет фракции',
  org_table: 'Планшет семьи',
  leave_fraction: 'Покинуть фракцию',
  leave_org: 'Покинуть семью',
}

const categoryName = ref(props.popupData.title)
const drawname = ref(props.popupData.title)
const muted = ref(false)
const selectAction = ref<string[]>(categoryData[props.popupData.title][props.popupData.id])

const onMouseOut = () => {
  drawname.value = categoryName.value
}

const onHovered = (index: number) => {
  if (index === 8) {
    drawname.value = 'Закрыть'
  } else if (selectAction.value[index] === 'vmuted') {
    drawname.value = muted.value ? 'Выключить микрофон' : 'Включить микрофон'
  } else {
    const action = selectAction.value[index]
    drawname.value = action == null ? categoryName.value : categoryDesc[action]
  }
}

const onCircleClick = (index: number) => {
  if (index === 8) {
    executeClient('client.circle.events', null, -1)
    ;(window as any).router?.setHud?.()
    return
  } else if (selectAction.value[index] === 'vmuted') {
    drawname.value = muted.value ? 'Выключить микрофон' : 'Включить микрофон'
  }

  switch (selectAction.value[index]) {
    case 'trunkAction':
      openCategory('Багажник', 0)
      break
    case 'sell':
      executeClient('client.circle.events', categoryName.value, Number(index))
      openCategory('Взаимодействия', 0)
      break
    case 'paired_animations':
      openCategory('Парные анимации', 0)
      break
    case 'fraction':
      // TODO: replace with Pinia charFractionID store
      if (charFractionID.value === 0 || charFractionID.value === 15) return
      openCategory('Фракция', charFractionID.value)
      break
    case 'family':
      // TODO: replace with Pinia charOrganizationID store
      if (charOrganizationID.value === 0) return
      openCategory('Семья', 0)
      break
    case 'documents':
      openCategory('Документы', 0)
      break
    case 'house':
      openCategory('Недвижимость', 0)
      break
    default:
      if (selectAction.value[index] === undefined) return
      if (categoryName.value === 'Категории' || categoryName.value === 'Анимации') {
        executeClient('client.circle.animation', categoryName.value, Number(index))
      } else {
        executeClient('client.circle.events', categoryName.value, Number(index))
        ;(window as any).router?.setHud?.()
      }
      break
  }
}

const openCategory = (category: string, id: number) => {
  if (category === 'vmuted') {
    muted.value = Boolean(id)
  } else {
    categoryName.value = category
    selectAction.value = categoryData[category][id]
  }
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

onMounted(() => {
  ;(window as any).events?.addEvent('cef.circle.category', openCategory)
})

onBeforeUnmount(() => {
  ;(window as any).events?.removeEvent('cef.circle.category', openCategory)
})
</script>

<template>
  <div class="circle" @mouseleave="onMouseOut">
    <div class="circle__close" @mouseenter="onHovered(8)" @mouseleave="onMouseOut"></div>
    <div class="center" @click="onCircleClick(8)" @mouseenter="onHovered(8)">
      <li
        v-for="(name, index) in selectAction"
        :key="index"
        :class="`contents child${ontest(index, selectAction.length)}`"
        @click="onCircleClick(index)"
      >
        <span :class="`icons-circle ${prefix}${name}${name === 'vmuted' ? `_${muted}` : ''}`" />
        <div>{{ categoryDesc[name] }}</div>
        <div class="contents__index">{{ index + 1 }}</div>
      </li>
    </div>
  </div>
</template>
