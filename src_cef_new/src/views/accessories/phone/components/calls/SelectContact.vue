<script setup lang="ts">
import { useDevice } from '@/views/accessories/shared/composables/useDevice'
import { useSelectContact } from '@/views/accessories/shared/composables/useSelectContact'

const props = defineProps<{
    updateListContacts: () => void
}>()

const emit = defineEmits<{ addContact: [] }>()

const device = useDevice()
const {
    contactData, isEdit, nameValue, avatarValue,
    getAvatar, onClose, updateEditStatus, onPopupImage,
    onUpdateContact, onAddBlackList, onDellBlackList, onDellContact,
    onCall, onMessage, onFocus, onBlur,
} = useSelectContact(props.updateListContacts)
</script>

<template>
    <div v-if="!isEdit">
        <div>
            <div @click="onClose">
                <div></div>
                <div>Контакты</div>
            </div>
            <div v-if="!contactData.IsSystem && contactData.IsAdded" @click="updateEditStatus">
                <div>Изменить</div>
            </div>
        </div>
        <div></div>
        <div>{{ contactData.Name }}</div>
        <div>
            <div @click="onMessage(contactData.Number)">
                <div></div>
                <div>Написать</div>
            </div>
            <div v-if="!contactData.IsSystem" @click="onCall(contactData.Number)">
                <div></div>
                <div>Позвонить</div>
            </div>
        </div>
        <div>
            <div>Номер телефона</div>
            <div>{{ contactData.Number }}</div>
        </div>
        <template v-if="!contactData.IsSystem">
            <div v-if="!contactData.IsAdded" @click="emit('addContact')">Добавить контакт</div>
            <div v-if="contactData.IsBlackList" @click="onDellBlackList">Разблокировать контакт</div>
            <div v-else @click="onAddBlackList">Заблокировать контакт</div>
            <div v-if="contactData.IsAdded" @click="onDellContact">Удалить контакт</div>
        </template>
    </div>

    <div v-else>
        <div>
            <div></div>
            <div @click="updateEditStatus"></div>
        </div>
        <div @click="onPopupImage"></div>
        <div>
            <div>Имя</div>
            <input v-model="nameValue" type="text" placeholder="Введите.." @focus="onFocus" @blur="onBlur" />
        </div>
        <div>
            <div>Номер</div>
            <input type="text" placeholder="Введите.." :value="device.selectNumber" disabled />
        </div>
        <div @click="onUpdateContact">Изменить контакт</div>
    </div>
</template>
