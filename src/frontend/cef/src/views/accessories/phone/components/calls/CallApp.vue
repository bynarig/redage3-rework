<script setup lang="ts">
import { ref } from 'vue'
import { useDevice } from '@/views/accessories/shared/composables/useDevice'
import PhoneHeader from '../PhoneHeader.vue'
import PhoneHomeButton from '../PhoneHomeButton.vue'
import DialPad from './DialPad.vue'
import ContactsList from './ContactsList.vue'
import RecentCalls from './RecentCalls.vue'

type CallView = 'dial' | 'contacts' | 'recent'

const device = useDevice()
const currentView = ref<CallView>('recent')

const updateView = (view: string) => {
    if (currentView.value === 'contacts') device.selectNumber = null
    currentView.value = view as CallView
}
</script>

<template>
    <div>
        <PhoneHeader />

        <RecentCalls v-if="currentView === 'recent'" :update-view="updateView" />
        <ContactsList v-else-if="currentView === 'contacts'" :update-view="updateView" />
        <DialPad v-else :update-view="updateView" />

        <div>
            <div>
                <div @click="updateView('recent')">
                    <div></div>
                    <div>Недавние</div>
                </div>
                <div @click="updateView('contacts')">
                    <div></div>
                    <div>Контакты</div>
                </div>
                <div @click="updateView('dial')">
                    <div></div>
                    <div>Клавиши</div>
                </div>
            </div>
            <PhoneHomeButton />
        </div>
    </div>
</template>
