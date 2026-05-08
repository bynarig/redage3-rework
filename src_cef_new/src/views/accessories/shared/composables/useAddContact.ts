import { ref, onUnmounted } from 'vue'
import { executeClientToGroup } from '@/api/rage'
import { useDevice } from './useDevice'

export function useAddContact(numberValue?: string | number, switchView?: (view: string) => void, refreshContacts?: () => void) {
    const device = useDevice()
    const nameValue = ref('')
    const localNumber = ref(String(numberValue ?? ''))

    const onAddContact = () => {
        if (!nameValue.value || nameValue.value.length < 2) {
            ;(window as any).notificationAdd?.(4, 9, 'Имя не может быть меньше 2 символов.', 3000)
            return
        }
        const number = Number(localNumber.value)
        if (!number || number < 10000 || number > 9999999) {
            ;(window as any).notificationAdd?.(4, 9, 'Некорректный номер телефона.', 3000)
            return
        }
        executeClientToGroup('addContact', number, nameValue.value)
        device.selectNumber = number
        switchView?.('contacts')
        refreshContacts?.()
    }

    const onFocus = () => executeClientToGroup('inputFocus', true)
    const onBlur = () => executeClientToGroup('inputFocus', false)

    onUnmounted(() => executeClientToGroup('inputFocus', false))

    return { nameValue, localNumber, onAddContact, onFocus, onBlur }
}
