import { ref, onUnmounted } from 'vue'
import { executeClient, executeClientAsyncToGroup, executeClientToGroup } from '@/api/rage'

export type SettingsSubView = null | 'Wallpaper' | 'SoundList' | 'SmsList'

export const RINGTONE_SOUNDS = [
    { name: 'iPhone Default', url: '../../shared/assets/sounds/ringtones/iphone_default.mp3' },

]

export const SMS_SOUNDS = [
    { name: 'Аврора', url: 'cloud/sound/iphone/notify/aurora.ogg' },
]

export function useSettings() {
    const selectedView = ref<SettingsSubView>(null)
    const isAir = ref(false)
    const forbesVisible = ref(false)

    executeClientAsyncToGroup('settings.isAir').then((r) => { isAir.value = !!r })
    executeClientAsyncToGroup('settings.forbesVisible').then((r) => { forbesVisible.value = !!r })

    const updateAirStatus = () => {
        isAir.value = !isAir.value
        executeClientToGroup('settings.air')
    }

    const updateForbesVisible = () => {
        forbesVisible.value = !forbesVisible.value
        executeClientToGroup('settings.forbesVisible')
    }

    const onRemoveSim = () => executeClientToGroup('settings.removeSim')

    const cloudBase = (window as any).document?.cloud ?? ''
    const wallpapers = Array.from({ length: 51 }, (_, i) => `${cloudBase}img/iphone/wallpapers/${i + 1}.png`)

    const selectWallpaper = ref(wallpapers[0])
    const defaultWallpaper = ref(wallpapers[0])

    executeClientAsyncToGroup('settings.wallpaper').then((r) => {
        if (r && typeof r === 'string') {
            selectWallpaper.value = r
            defaultWallpaper.value = r
        }
    })

    const selectRingtoneIndex = ref(0)
    const defaultRingtoneIndex = ref(0)
    const selectSmsIndex = ref(0)
    const defaultSmsIndex = ref(0)

    executeClientAsyncToGroup('settings.bellId').then((r) => {
        if (typeof r === 'number') { selectRingtoneIndex.value = r; defaultRingtoneIndex.value = r }
    })
    executeClientAsyncToGroup('settings.smsId').then((r) => {
        if (typeof r === 'number') { selectSmsIndex.value = r; defaultSmsIndex.value = r }
    })

    const onSelectRingtone = (url: string, index: number) => {
        selectRingtoneIndex.value = index
        executeClientToGroup('settings.play', url)
    }

    const onSelectSms = (url: string, index: number) => {
        selectSmsIndex.value = index
        executeClientToGroup('settings.play', url)
    }

    const onOpenView = (view: SettingsSubView) => { selectedView.value = view }

    onUnmounted(() => {
        if (defaultWallpaper.value !== selectWallpaper.value) {
            executeClientToGroup('settings.wallpaper', selectWallpaper.value)
        }
        if (defaultRingtoneIndex.value !== selectRingtoneIndex.value) {
            executeClientToGroup('settings.bellId', selectRingtoneIndex.value)
        }
        if (defaultSmsIndex.value !== selectSmsIndex.value) {
            executeClientToGroup('settings.smsId', selectSmsIndex.value)
        }
        executeClient('sounds.stop', 'phoneSound')
    })

    return {
        selectedView,
        isAir,
        forbesVisible,
        wallpapers,
        selectWallpaper,
        selectRingtoneIndex,
        selectSmsIndex,
        ringtoneSounds: RINGTONE_SOUNDS,
        smsSounds: SMS_SOUNDS,
        updateAirStatus,
        updateForbesVisible,
        onRemoveSim,
        onSelectRingtone,
        onSelectSms,
        onOpenView,
    }
}
