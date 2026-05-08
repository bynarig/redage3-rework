<script setup lang="ts">
import { ref } from 'vue'
import { useDevice } from '@/views/accessories/shared/composables/useDevice'
import TabletHeader from '../TabletHeader.vue'
import MessagesList from '../../../phone/components/messages/MessagesList.vue'
import MessageChat from '../../../phone/components/messages/MessageChat.vue'

const device = useDevice()

const selectedNumber = ref<number | null>(device.selectNumber)
const isBack = selectedNumber.value !== null && selectedNumber.value > 0

const onSelectNumber = (number: number) => {
    if (number === -1) {
        if (isBack) {
            device.pageBack()
        } else {
            selectedNumber.value = null
            device.selectNumber = null
        }
    } else {
        selectedNumber.value = number
        device.selectNumber = number
    }
}
</script>

<template>
    <div>
        <TabletHeader />
        <div>
            <MessagesList
                v-if="selectedNumber === null"
                @select-number="onSelectNumber"
            />
            <MessageChat
                v-else
                :on-select-number="onSelectNumber"
                :selected-number="selectedNumber"
            />
        </div>
    </div>
</template>
