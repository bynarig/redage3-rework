<script setup lang="ts">
import AddContact from './AddContact.vue'
import { useDialPad } from '@/views/accessories/shared/composables/useDialPad'

const props = defineProps<{
    updateView: (view: string) => void
}>()

const { numberValue, onButton, onRemoveButton, onCall, onFocus, onBlur } = useDialPad()
</script>

<template>
    <div>
        <input
            v-model="numberValue"
            type="text"
            placeholder="Введите номер"
            @focus="onFocus"
            @blur="onBlur"
        />

        <div>
            <div @click="onButton('1')">1</div>
            <div @click="onButton('2')">2</div>
            <div @click="onButton('3')">3</div>
            <div @click="onButton('4')">4</div>
            <div @click="onButton('5')">5</div>
            <div @click="onButton('6')">6</div>
            <div @click="onButton('7')">7</div>
            <div @click="onButton('8')">8</div>
            <div @click="onButton('9')">9</div>
            <div>*</div>
            <div @click="onButton('0')">0</div>
            <div>#</div>
            <div></div>
            <div @click="onCall(numberValue)"><div></div></div>
            <div @click="onRemoveButton"><div>✖</div></div>
        </div>
    </div>
</template>
