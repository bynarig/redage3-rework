import { ref, onMounted } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { useDevice } from './useDevice'
import type { CallInfo } from '../types/calls'

export function useCallView() {
    const device = useDevice()

    const callInfo = ref<CallInfo>({})
    const isMute = ref(false)
    const background = ref('')

    const getAvatar = (avatar?: string) => {
        if (avatar && avatar.length > 6) return `background-image: url(${avatar})`
        return ''
    }

    const updateStatus = () => {
        executeClientAsyncToGroup('getComingPhone').then((result) => {
            if (result && typeof result === 'string') callInfo.value = JSON.parse(result)
        })
    }

    const updateMute = () => {
        isMute.value = !isMute.value
        executeClientToGroup('mute', isMute.value)
    }

    const upPhone = () => executeClientToGroup('take')

    const downPhone = () => {
        executeClientToGroup('put')
        executeClientToGroup('mute', false)
    }

    const onSystemMessage = (number: unknown) => {
        device.selectNumber = number as number
        device.setPage('messages')
    }

    addListernEvent('callAccept', updateStatus)
    addListernEvent('downPhone', () => device.pageBack())
    addListernEvent('phone.call.onMessage', onSystemMessage as (...args: unknown[]) => void)

    onMounted(() => {
        updateStatus()
        executeClientAsyncToGroup('settings.wallpaper').then((result) => {
            if (result && typeof result === 'string') background.value = result
        })
    })

    return { callInfo, isMute, background, getAvatar, updateStatus, updateMute, upPhone, downPhone }
}
