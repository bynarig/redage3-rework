<script setup lang="ts">
import { ref } from 'vue'
import { useDevice } from '@/views/accessories/shared/composables/useDevice'
import MessagesList from '../../../phone/components/messages/MessagesList.vue'
import MessageChat from '../../../phone/components/messages/MessageChat.vue'
import AppButton from "@/views/accessories/shared/components/AppButton.vue";

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
    <div class="messages-app">
        <div class="sidebar">
            <div class="sidebar-header">
                <span class="sidebar-title">Сообщения</span>
            </div>
            <div class="sidebar-content">
                <MessagesList @select-number="onSelectNumber" />
            </div>
        </div>
        <div class="chat-panel">
            <MessageChat
                v-if="selectedNumber !== null"
                :on-select-number="onSelectNumber"
                :selected-number="selectedNumber"
            />
            <div v-else class="empty-state">
                <div class="empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#6e6e73" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div class="empty-title">Выберите чат</div>
                <div class="empty-subtitle">Выберите разговор из списка слева</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.messages-app {
    display: flex;
    height: 100%;
    background: #f5f5f7;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Helvetica, Arial, sans-serif;
    overflow: hidden;
}

.sidebar {
    width: 280px;
    flex-shrink: 0;
    background: #ffffff;
    border-right: 1px solid rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.sidebar-header {
    padding: 16px 16px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    flex-shrink: 0;
}

.sidebar-title {
    font-size: 17px;
    font-weight: 600;
    color: #1d1d1f;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
}

.sidebar-content::-webkit-scrollbar {
    width: 4px;
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
}

.chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f5f5f7;
}

.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: #6e6e73;
}

.empty-icon {
    width: 72px;
    height: 72px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.empty-title {
    font-size: 17px;
    font-weight: 600;
    color: #1d1d1f;
}

.empty-subtitle {
    font-size: 13px;
    color: #6e6e73;
    text-align: center;
}
</style>
