import { ref } from 'vue'
import { executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { useDevice } from './useDevice'
import type { TinderView, TinderProfile, TinderUser } from '../types/tinder'

export function useTinder() {
    const device = useDevice()

    const isLoad = ref(false)
    const isCreate = ref(false)
    const view = ref<TinderView>('Profile')
    const profile = ref<TinderProfile>({})
    const isEditProfile = ref(false)
    const editText = ref('')
    const editType = ref(0)
    const tinderList = ref<TinderUser[]>([])
    const matches = ref<TinderUser[]>([])

    const loadProfile = () => {
        executeClientAsyncToGroup('tinder.getProfile').then((result) => {
            if (result && typeof result === 'string') {
                try {
                    profile.value = JSON.parse(result)
                    editText.value = profile.value.text ?? ''
                    editType.value = profile.value.type ?? 0
                } catch {}
            }
        })
    }

    const loadList = () => {
        executeClientAsyncToGroup('tinder.getList').then((result) => {
            if (result && typeof result === 'string') {
                try { tinderList.value = JSON.parse(result) } catch {}
            }
        })
    }

    const loadMatches = () => {
        executeClientAsyncToGroup('tinder.getMatches').then((result) => {
            if (result && typeof result === 'string') {
                try { matches.value = JSON.parse(result) } catch {}
            }
        })
    }

    executeClientToGroup('tinder.load')

    addListernEvent('phone.tinder.load', (...args: unknown[]) => {
        const toggled = args[0] as boolean
        isCreate.value = toggled
        isLoad.value = true
        if (toggled) view.value = 'List'
        loadProfile()
        loadList()
        loadMatches()
    })

    addListernEvent('phone.tinder.getList', loadList)
    addListernEvent('phone.tinder.getProfile', loadProfile)

    const onSaveProfile = () => {
        executeClientToGroup('tinder.save', profile.value.avatar ?? '', editText.value, editType.value, profile.value.isVisible ?? 1)
        isEditProfile.value = false
        if (!isCreate.value) isLoad.value = false
    }

    const onSelectAvatar = () => {
        if (device.selectedImage !== undefined && device.selectedImageFunc !== undefined) {
            device.selectedImage = true
            device.selectedImageFunc = (link: string) => {
                profile.value = { ...profile.value, avatar: link }
            }
        }
    }

    const onAction = (isLove: boolean) => {
        if (!tinderList.value.length) return
        const user = tinderList.value[0]
        if (user) {
            executeClientToGroup('tinder.action', user.uuid, isLove)
            tinderList.value.splice(0, 1)
        }
    }

    const onOpenMessages = (uuid: string) => {
        executeClientToGroup('tinder.openChat', uuid)
        device.setPage('messages')
    }

    return {
        isLoad,
        isCreate,
        view,
        profile,
        isEditProfile,
        editText,
        editType,
        tinderList,
        matches,
        onSaveProfile,
        onSelectAvatar,
        onAction,
        onOpenMessages,
    }
}
