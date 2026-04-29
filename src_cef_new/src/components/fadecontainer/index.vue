<script setup lang="ts">
import './main.scss'
import { ref } from 'vue'

const inDuration = ref(0)
const outDuration = ref(0)
const visible = ref(true)
const textInfo = ref(true)

;(window as any).FadeScreen = (toggled: boolean, speed: number) => {
  visible.value = toggled
  if (toggled) inDuration.value = speed / 3
  else outDuration.value = speed / 3
  if (!visible.value && textInfo.value) textInfo.value = false
}
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" id="fadecontainer">
      <div class="box-logo" />
      <div class="pointBlock__circle" />
      <Transition name="fade-info">
        <div v-if="textInfo" class="text-info">
          Подсказка...<br />
          Если вы видите данное сообщение - значит, у вас происходит<br />
          подключение к серверу. Ожидайте, не сворачивая игру!
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active {
  transition: opacity v-bind('`${inDuration}ms`') linear;
}
.fade-leave-active {
  transition: opacity v-bind('`${outDuration}ms`') linear;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-info-leave-active {
  transition: opacity v-bind('`${outDuration}ms`') linear;
}
.fade-info-leave-to {
  opacity: 0;
}
</style>
