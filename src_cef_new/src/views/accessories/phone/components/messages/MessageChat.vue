<script setup lang="ts">
import EmojiPicker from './EmojiPicker.vue'
import { useMessageChat } from '@/views/accessories/shared/composables/useMessageChat'

const props = defineProps<{
    onSelectNumber: (n: number) => void
    selectedNumber: number
}>()

const {
    messages, contactData, inputValue, isSmile, chatStatus, chatStatusName,
    chatElement, inputDiv, INPUT_MAX_LENGTH,
    formatTime, formatMessage, onScroll, onSend, onKeyUp,
    sendGeo, onMapClick, onFocus, onBlur, onInput, addSmile, onContact,
} = useMessageChat(props.selectedNumber)
</script>

<template>
    <div>
        <div @click="props.onSelectNumber(-1)"></div>
        <div>
            <div>{{ contactData.Name }}</div>
            <div>{{ chatStatusName[chatStatus] }}</div>
        </div>
        <div @click="onContact"></div>
    </div>

    <div ref="chatElement" @scroll="onScroll">
        <div
            v-for="(msg, idx) in messages"
            :key="msg.Id ?? idx"
            @click="onMapClick(msg)"
        >
            <template v-if="msg.Type === 0">
                <div v-html="formatMessage(msg.Text)"></div>
            </template>
            <template v-else-if="msg.Type === 1">
                <div>📍 Геопозиция</div>
            </template>
            <template v-else-if="msg.Type === 2">
                <img :src="msg.Text" />
            </template>
            <div v-if="msg.Status === 0">Отправка...</div>
            <div v-else-if="msg.Status === 2">Ошибка</div>
            <div v-else-if="msg.Date">{{ formatTime(msg.Date) }}</div>
        </div>
    </div>

    <div>
        <div v-if="!contactData.IsSystem" @click="sendGeo"></div>

        <input
            ref="inputDiv"
            v-model="inputValue"
            type="text"
            :placeholder="`Написать ${contactData.Name ?? ''}`"
            :maxlength="INPUT_MAX_LENGTH"
            @focus="onFocus"
            @blur="onBlur"
            @input="onInput"
            @keyup="onKeyUp"
        />

        <div v-if="!contactData.IsSystem" @click="isSmile = !isSmile"></div>

        <EmojiPicker v-if="isSmile" @select="addSmile" />

        <div @click="onSend(0)"></div>
    </div>
</template>
