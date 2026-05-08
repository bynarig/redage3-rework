<script setup lang="ts">
import { useAddContact } from '@/views/accessories/shared/composables/useAddContact'

const props = defineProps<{
    numberValue?: string | number
    updateView: (view: string) => void
    updateListContacts?: () => void
}>()

const emit = defineEmits<{ close: [] }>()

const { nameValue, localNumber, onAddContact, onFocus, onBlur } = useAddContact(
    props.numberValue,
    props.updateView,
    props.updateListContacts,
)
</script>

<template>
    <div>
        <div>
            <div>
                <div></div>
                <div @click="emit('close')"></div>
            </div>
            <div><div></div></div>
            <div>
                <div>Имя</div>
                <input v-model="nameValue" type="text" placeholder="Введите.." @focus="onFocus" @blur="onBlur" />
            </div>
            <div>
                <div>Номер</div>
                <input v-model="localNumber" type="text" placeholder="Введите.." @focus="onFocus" @blur="onBlur" />
            </div>
            <div @click="onAddContact">
                <div></div>
                Добавить контакт
            </div>
        </div>
    </div>
</template>
