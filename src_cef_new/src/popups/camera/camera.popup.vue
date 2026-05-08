<script setup lang="ts">
import './main.scss'
import { translateText } from 'lang'
import { executeClient } from 'api/rage'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// TODO: migrate router store to Pinia — was $router.opacity in Svelte

const cameraData = ref({
  timeCycle: 'Filter (1)',
  animName: '',
  emotion: 'Emotion (1)',
  isPhoneThisFrame: false,
  isFreeMode: false,
  isDofEnabled: true,
})

const onFreeMode = () => executeClient('camera.freemode')
const onClose = () => executeClient('camera.close')
const onScreen = () => executeClient('camera.screen')

const onKeyUp = (event: KeyboardEvent) => {
  // TODO: replace with Pinia router store opacity check
  if (!(window as any).router?.opacity) return
  const { keyCode } = event
  if (keyCode === 9) onFreeMode()
  if (keyCode === 13) onScreen()
  if (keyCode === 27) onClose()
}

const updateCameraClose = (_isScreen: boolean) => {
  ;(window as any).router?.setPopUp?.()
}

const onCameraUpdate = (json: string) => {
  cameraData.value = JSON.parse(json)
}

onMounted(() => {
  window.addEventListener('keyup', onKeyUp)
  ;(window as any).events?.addEvent('camera.close', updateCameraClose)
  ;(window as any).events?.addEvent('camera.update', onCameraUpdate)
})

onBeforeUnmount(() => {
  window.removeEventListener('keyup', onKeyUp)
  ;(window as any).events?.removeEvent('camera.close', updateCameraClose)
  ;(window as any).events?.removeEvent('camera.update', onCameraUpdate)
})
</script>

<template>
  <div id="photo">
    <div class="photo__buttons">
      <div v-if="!cameraData.isPhoneThisFrame" class="photo__bottom_buttons center">
        <div class="photo__bottom_button">TAB</div>
        <div>{{ !cameraData.isFreeMode ? 'Убрать камеру' : 'Достать камеру' }}</div>
      </div>
      <div class="box-flex">
        <template v-if="!cameraData.isFreeMode">
          <template v-if="cameraData.isPhoneThisFrame">
            <div class="photo__absolute_leftbottom">
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button">ENTER</div>
                <div>{{ translateText('popups', 'Фото') }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button mr-5">W</div>
                <div class="photo__bottom_button">S</div>
                <div>{{ cameraData.timeCycle }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button mr-5">A</div>
                <div class="photo__bottom_button">D</div>
                <div>{{ translateText('popups', 'Смена действия') }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button">SHIFT</div>
                <div>{{ cameraData.animName }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button mr-5">Q</div>
                <div class="photo__bottom_button">E</div>
                <div>{{ cameraData.emotion }}</div>
              </div>
            </div>
            <div class="photo__absolute_rightbottom">
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button">&#x2191;</div>
                <div>{{ translateText('popups', 'Вид') }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button">V</div>
                <div>{{ translateText('popups', 'Боке') }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__mouseleft"></div>
                <div>{{ translateText('popups', 'Ракурс') }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__mouseright"></div>
                <div>{{ translateText('popups', 'Профиль') }}</div>
              </div>
              <div class="photo__bottom_buttons esc">
                <div class="photo__bottom_button">ESC</div>
                <div>{{ translateText('popups', 'Назад') }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="photo__absolute_leftbottom">
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button">ENTER</div>
                <div>{{ translateText('popups', 'Фото') }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__bottom_button mr-5">W</div>
                <div class="photo__bottom_button">S</div>
                <div>{{ cameraData.timeCycle }}</div>
              </div>
              <div class="photo__bottom_buttons center">
                <div class="photo__mousemiddle"></div>
                <div>{{ translateText('popups', 'Зум') }}</div>
              </div>
            </div>
            <div class="photo__absolute_rightbottom">
              <div v-if="cameraData.isDofEnabled" class="photo__bottom_buttons center">
                <div class="photo__bottom_button">&#x2191;</div>
                <div>{{ translateText('popups', 'Вид') }}</div>
              </div>
              <div class="photo__bottom_buttons esc">
                <div class="photo__bottom_button">ESC</div>
                <div>{{ translateText('popups', 'Назад') }}</div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
