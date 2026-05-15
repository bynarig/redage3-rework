import { ref, onMounted } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'
import { useDevice } from './useDevice'
import type { RecentCall } from '../types/calls'

export function useRecentCalls() {
    const device = useDevice()
    const recents = ref<RecentCall[]>([])

    const formatTime = (time: string) => {
        if (!time) return ''
        const d = new Date(time)
        if (isNaN(d.getTime())) return ''
        return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    }

    const onCall = (number: number) => {
        if (!number || number < 10000 || number > 9999999) {
            ;(window as any).notificationAdd?.(4, 9, 'Некорректный номер телефона.', 3000)
            return
        }
        executeClientToGroup('call', number)
        device.setPage('callView')
    }

    const onClear = () => {
        executeClientAsyncToGroup('recentsClear').then((result) => {
            if (result) recents.value = []
        })
    }

    const onInfo = (event: Event, number: number, switchView: (view: string) => void) => {
        event.stopPropagation()
        device.selectNumber = number
        switchView('contacts')
    }

    onMounted(() => {
        executeClientAsyncToGroup('getRecents').then((result) => {
            if (result && typeof result === 'string') recents.value = JSON.parse(result)
        })
    })

    return { recents, formatTime, onCall, onClear, onInfo }
}
