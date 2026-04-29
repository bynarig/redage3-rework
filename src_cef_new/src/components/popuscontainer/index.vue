<script setup lang="ts">
import './main.scss'

defineProps<{
  visible?: boolean
  opacity?: number
}>()
</script>

<template>
  <div id="popuscontainer" :class="{ active: visible }" :style="{ opacity }">
    <slot />
  </div>
</template>
