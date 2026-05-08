<script setup lang="ts">
import { useDevice } from '@/views/accessories/shared/composables/useDevice'
import { useContactsList } from '@/views/accessories/shared/composables/useContactsList'
import AddContact from './AddContact.vue'
import SelectContact from './SelectContact.vue'

const props = defineProps<{
    updateView: (view: string) => void
}>()

const device = useDevice()
const {
    searchText, isPopup, contactsData, contactsSystemData,
    updateListContacts, onSelectContact, filterCheck, onFocus, onBlur,
} = useContactsList()
</script>

<template>
    <div>
        <AddContact
            v-if="isPopup"
            :number-value="device.selectNumber ?? undefined"
            :update-view="props.updateView"
            :update-list-contacts="updateListContacts"
            @close="isPopup = false"
        />

        <SelectContact
            v-else-if="device.selectNumber !== null"
            :update-list-contacts="updateListContacts"
            @add-contact="isPopup = true"
        />

        <template v-else>
            <div>
                <div>Контакты</div>
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
            <div>
                <div></div>
                <div><div>Мой телефон</div></div>
            </div>
            <div>
                <div>Службы</div>
                <template v-for="letterData in contactsSystemData" :key="letterData.Name">
                    <template v-for="contact in letterData.List" :key="contact.Number">
                        <div
                            v-if="!contact.IsNotShow"
                            @click="onSelectContact(contact.Number, true)"
                        >
                            {{ contact.Name }}
                        </div>
                    </template>
                </template>
                <template v-for="letterData in contactsData.filter(el => filterCheck(el, searchText))" :key="letterData.Name">
                    <div>{{ letterData.Name }}</div>
                    <div
                        v-for="contact in letterData.List"
                        :key="contact.Number"
                        @click="onSelectContact(contact.Number)"
                    >
                        {{ contact.Name }}
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>
