<script setup lang="ts">
import { useRecentCalls } from '@/views/accessories/shared/composables/useRecentCalls'

const props = defineProps<{
    updateView: (view: string) => void
}>()

const { recents, formatTime, onCall, onClear, onInfo } = useRecentCalls()
</script>

<template>
    <div>
        <div>
            <div>Недавние</div>
            <div @click="onClear">Очистить</div>
        </div>

        <div v-if="recents.length > 0">
            <div
                v-for="recent in recents"
                :key="recent.Number"
                @click="onCall(recent.Number)"
            >
                <div>
                    <div></div>
                    <div>{{ recent.Name }}</div>
                </div>
                <div>
                    <div>{{ formatTime(recent.time) }}</div>
                    <div @click="(e) => onInfo(e, recent.Number, props.updateView)">
                        <div></div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            История звонков была очищена или с данной сим-карты ещё не было звонков. Пора совершить первый!
        </div>
    </div>
</template>
