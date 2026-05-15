<script setup lang="ts">
import PhoneHeader from '../PhoneHeader.vue'
import PhoneHomeButton from '../PhoneHomeButton.vue'
import { useCallView } from '@/views/accessories/shared/composables/useCallView'

const { callInfo, isMute, background, getAvatar, updateMute, upPhone, downPhone } = useCallView()
</script>

<template>
    <div>
        <div>
            <PhoneHeader />
            <div>
                <div></div>

                <div>{{ callInfo.Name }}</div>
                <div>{{ !callInfo.isComing ? 'Вызов..' : 'Идет разговор..' }}</div>

                <div>
                    <div v-if="callInfo.isComing" @click="updateMute">
                        <div></div>
                    </div>
                </div>

                <div>
                    <div>
                        <div @click="downPhone"><div></div></div>
                        <div>Отклонить</div>
                    </div>
                    <div v-if="!callInfo.isCall && !callInfo.isComing">
                        <div @click="upPhone"><div></div></div>
                        <div>Принять</div>
                    </div>
                </div>
            </div>
            <PhoneHomeButton />
        </div>
    </div>
</template>
