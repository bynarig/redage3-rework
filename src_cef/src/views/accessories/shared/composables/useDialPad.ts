import { ref, onUnmounted } from 'vue'
import { executeClientToGroup } from '@/api/rage'
import { useDevice } from './useDevice'
import { useNotificationStore } from '@/stores/notification'

export function useDialPad() {
    const device = useDevice()
    const notifications = useNotificationStore()
    const numberValue = ref('')

    const onButton = (value: string) => { numberValue.value += value }
    const onRemoveButton = () => { numberValue.value = numberValue.value.slice(0, -1) }

    const onCall = (number: string) => {
        const n = Number(number)
        if (!n || n < 10000 || n > 9999999) {
            notifications.add(4, 9, 'Некорректный номер телефона.', 3000)
            return
        }
        executeClientToGroup('call', n)
        device.setPage('callView')
    }

    const onFocus = () => executeClientToGroup('inputFocus', true)
    const onBlur = () => executeClientToGroup('inputFocus', false)

    onUnmounted(() => executeClientToGroup('inputFocus', false))

    return { numberValue, onButton, onRemoveButton, onCall, onFocus, onBlur }
}
