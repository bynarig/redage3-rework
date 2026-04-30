<script setup lang="ts">
import './main.scss'
import { ref, onMounted } from 'vue'

const filterOpacity = ref(0.9)
const smokeOpacity = ref(1.0)
const shadowOpacity = ref(1.0)

onMounted(() => {
  ;(window as any).events?.addEvent(
    'cef.filter.UpdateFilter',
    (filter: number, smoke: number, shadow: number) => {
      filterOpacity.value = filter
      smokeOpacity.value = smoke
      shadowOpacity.value = shadow
    },
  )
})
</script>

<template>
  <div class="filter">
    <span class="filter-img filter" :style="{ opacity: filterOpacity }" />
    <span class="filter-img smoke" :style="{ opacity: smokeOpacity }" />
    <span class="filter-img shadow" :style="{ opacity: shadowOpacity }" />
  </div>
</template>
