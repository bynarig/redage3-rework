import { ref, onMounted, onUnmounted } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'
import type { MessagePreview } from '../types/messages'

export function useMessagesList() {
    const messages = ref<MessagePreview[]>([])
    const searchText = ref('')
    const isPopup = ref(false)
    const popupNumber = ref('')

    const formatTime = (time: string) => {
        if (!time) return ''
        const d = new Date(time)
        if (isNaN(d.getTime())) return ''
        const now = new Date()
        const diff = now.getTime() - d.getTime()
        if (diff < 86400000) return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
        return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
    }

    const getAvatar = (avatar?: string) => (avatar && avatar.length > 6 ? avatar : '')

    const filterCheck = (msg: MessagePreview, text: string) => {
        if (!text) return true
        const upper = text.toUpperCase()
        return msg.Name.toUpperCase().includes(upper) || String(msg.Number).includes(upper)
    }

    const typeLabel = (type: number) => {
        if (type === 1) return 'Геопозиция'
        if (type === 2) return 'Фотография'
        return ''
    }

    const openNewChat = (emit: (number: number) => void) => {
        const n = Number(popupNumber.value)
        if (!n || n < 10000) return
        emit(n)
        isPopup.value = false
        popupNumber.value = ''
    }

    const onFocus = () => executeClientToGroup('inputFocus', true)
    const onBlur = () => executeClientToGroup('inputFocus', false)

    onMounted(() => {
        executeClientAsyncToGroup('getMessages').then((result) => {
            if (result && typeof result === 'string') messages.value = JSON.parse(result)
        })
    })

    onUnmounted(() => executeClientToGroup('inputFocus', false))

    return {
        messages,
        searchText,
        isPopup,
        popupNumber,
        formatTime,
        getAvatar,
        filterCheck,
        typeLabel,
        openNewChat,
        onFocus,
        onBlur,
    }
}
