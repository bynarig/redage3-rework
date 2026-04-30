<script setup lang="ts">
import './main.scss'

defineProps<{
  title?: string
  subtitle?: string
  notifictiontype?: boolean
}>()
</script>

<template>
  <div class="notification-form">
    <div
      class="notification-form__square box-center"
      :class="{
        'notification-form__square_accept': notifictiontype === true,
        'notification-form__square_error': notifictiontype === false,
      }"
    >
      <span class="auth-key" />
    </div>
    <div class="notification-form__text-box">
      <div class="notification-form__title">{{ title }}</div>
      <div class="notification-form__subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<style scoped>
/* Replaces Svelte transition:fly="{{ y: -200, duration: 800 }}" */
.notification-form {
  animation: fly-in 0.8s ease forwards;
}

@keyframes fly-in {
  from {
    transform: translateY(-200px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
