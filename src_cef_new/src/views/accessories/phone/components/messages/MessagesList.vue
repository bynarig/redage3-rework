<script setup lang="ts">
import { useMessagesList } from '@/views/accessories/shared/composables/useMessagesList'

const emit = defineEmits<{ selectNumber: [number: number] }>()

const {
    messages, searchText, isPopup, popupNumber,
    formatTime, getAvatar, filterCheck, typeLabel, openNewChat, onFocus, onBlur,
} = useMessagesList()
</script>

<template>
    <div>
        <div>
            <div>Чаты</div>
            <div @click="isPopup = true">+</div>
        </div>

        <div>
            <div></div>
            <input
                v-model="searchText"
                type="text"
                placeholder="Поиск"
                @focus="onFocus"
                @blur="onBlur"
            />
        </div>

        <!-- New chat popup -->
        <div v-if="isPopup">
            <div>
                <div>
                    <div>Новый чат</div>
                    <div @click="isPopup = false"></div>
                </div>
                <div>
                    <div>Номер</div>
                    <input
                        v-model="popupNumber"
                        type="text"
                        placeholder="Введите номер.."
                        @focus="onFocus"
                        @blur="onBlur"
                    />
                </div>
                <div @click="openNewChat((n) => emit('selectNumber', n))">Написать</div>
            </div>
        </div>

        <div>
            <div
                v-for="msg in messages.filter(m => filterCheck(m, searchText))"
                :key="msg.Number"
                @click="emit('selectNumber', msg.Number)"
            >
                <div></div>
                <div></div>
                <div>
                    <div>
                        <div>{{ msg.Name }}</div>
                        <div>{{ formatTime(msg.Date) }}</div>
                    </div>
                    <div v-if="msg.IsWrite">Что-то печатает..</div>
                    <div v-else-if="msg.DraftText">Черновик: {{ msg.DraftText }}</div>
                    <div v-else>
                        <span v-if="msg.Type === 0">{{ msg.Text }}</span>
                        <span v-else>{{ typeLabel(msg.Type) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
