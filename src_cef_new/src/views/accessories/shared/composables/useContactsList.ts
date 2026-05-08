import { ref, onMounted, onUnmounted } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'
import { useDevice } from './useDevice'
import type { ContactGroup } from '../types/calls'

export function useContactsList() {
    const device = useDevice()
    const searchText = ref('')
    const isPopup = ref(false)
    const contactsData = ref<ContactGroup[]>([])
    const contactsSystemData = ref<ContactGroup[]>([])

    const ruCollator = new Intl.Collator('ru-RU')

    const filterCheckSystem = (data: ContactGroup) => data.List.some((el) => el.IsSystem)

    const updateListContacts = () => {
        isPopup.value = false
        executeClientAsyncToGroup('getContacts').then((result) => {
            if (result && typeof result === 'string') {
                const parsed: ContactGroup[] = JSON.parse(result)
                const sorted = parsed.sort((a, b) => ruCollator.compare(a.Name, b.Name))
                contactsData.value = sorted.filter((el) => !filterCheckSystem(el))
                contactsSystemData.value = sorted.filter((el) => filterCheckSystem(el))
            }
        })
    }

    const onSelectContact = (number: number, isMessageDefault = false) => {
        device.selectNumber = number
        if (isMessageDefault) executeClientToGroup('messageDefault', number)
    }

    const filterCheck = (data: ContactGroup, text: string) => {
        if (!text) return true
        const upper = text.toUpperCase()
        return data.List.some((el) => el.Name.toString().toUpperCase().includes(upper))
    }

    const onFocus = () => executeClientToGroup('inputFocus', true)
    const onBlur = () => executeClientToGroup('inputFocus', false)

    onMounted(() => updateListContacts())
    onUnmounted(() => executeClientToGroup('inputFocus', false))

    return {
        searchText,
        isPopup,
        contactsData,
        contactsSystemData,
        updateListContacts,
        onSelectContact,
        filterCheck,
        onFocus,
        onBlur,
    }
}
