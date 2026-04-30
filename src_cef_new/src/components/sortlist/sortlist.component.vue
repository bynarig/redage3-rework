<script setup lang="ts">
import './main.scss'
import { ref } from 'vue'

interface Column {
  key: string
  name: string
  width: number
  sortable?: boolean
  reverse?: boolean
}

const props = defineProps<{
  columns?: Column[]
  elements?: any[]
  searchKey?: string
}>()

const emit = defineEmits<{
  'update:elements': [elements: any[]]
  'update:columns': [columns: Column[]]
}>()

const selectedSortKey = ref('')
const searchText = ref('')

const filterCheck = (el: any, text: string): boolean => {
  text = text.toLowerCase().trim()
  if (!props.searchKey) return true

  if (!el[props.searchKey]) {
    return Object.values(el).some((item) => {
      if (!Array.isArray(item)) {
        return String(item).toLowerCase().trim().includes(text.replace(' ', '_'))
      }
      return (item as any[]).some((i) =>
        String(i).toLowerCase().trim().includes(text.replace(' ', '_')),
      )
    })
  }

  return String(el[props.searchKey]).toLowerCase().trim().includes(text.replace(' ', '_'))
}

const selectSort = (column: Column) => {
  if (!column.sortable) return

  const items = [...(props.elements ?? [])]

  if (selectedSortKey.value === column.key) {
    emit('update:elements', items.reverse())
  } else {
    selectedSortKey.value = column.key
    emit(
      'update:elements',
      items.sort((a, b) =>
        a[column.key] > b[column.key] ? 1 : a[column.key] < b[column.key] ? -1 : 0,
      ),
    )
  }

  emit(
    'update:columns',
    (props.columns ?? []).map((c) =>
      c.key === column.key ? { ...c, reverse: !c.reverse } : c,
    ),
  )
}
</script>

<template>
  <div class="box-sortlist">
    <div class="box-input">
      <input
        v-if="searchKey"
        v-model="searchText"
        placeholder="Поиск человека"
        type="text"
        maxlength="32"
        class="sort-input"
      />
    </div>
    <div class="box-header">
      <div
        v-for="column in columns"
        :key="column.key"
        class="desc"
        :style="`width: ${column.width}%`"
        :class="{ active: selectedSortKey === column.key }"
        @click="selectSort(column)"
      >
        {{ column.name }}
        <div
          v-if="column.sortable"
          class="triangle"
          :class="{ up: !column.reverse, down: column.reverse }"
        />
      </div>
    </div>
    <div class="listScrollBar">
      <slot
        v-for="(element, index) in (elements ?? []).filter((el) => filterCheck(el, searchText))"
        :key="index"
        :index="index"
        :element="element"
      />
    </div>
  </div>
</template>
