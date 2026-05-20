<script setup lang="ts">
import { ref } from 'vue'
import { IosProgressBar } from '@/views/components/ui'

const props = withDefaults(defineProps<{
    loadingText?: string
    showLogo?: boolean
    showText?: boolean
}>(), {
    loadingText: 'Якщо ви бачите це повідомлення — відбувається підключення до сервера. Зачекайте, не згортаючи гру!',
    showLogo: true,
    showText: true,
})

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
            <div v-if="showLogo" class="box-logo">
                <slot name="logo" />
            </div>

            <div class="loader-area">
                <div class="pointBlock__circle" />
                <IosProgressBar color="neutral" size="sm" indeterminate class="fade-progress" />
            </div>

            <Transition name="fade-info">
                <div v-if="textInfo && showText" class="text-info">
                    <slot name="hint">
                        Підказка...<br />
                        {{ loadingText }}
                    </slot>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
/*.fade-enter-active {*/
/*    transition: opacity v-bind('`${inDuration}ms`') linear;*/
/*}*/
/*.fade-leave-active {*/
/*    transition: opacity v-bind('`${outDuration}ms`') linear;*/
/*}*/
/*.fade-enter-from,*/
/*.fade-leave-to {*/
/*    opacity: 0;*/
/*}*/
/*.fade-info-leave-active {*/
/*    transition: opacity v-bind('`${outDuration}ms`') linear;*/
/*}*/
/*.fade-info-leave-to {*/
/*    opacity: 0;*/
/*}*/

.loader-area {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.fade-progress {
    width: 120px;
    margin-top: 16px;
}
</style>
