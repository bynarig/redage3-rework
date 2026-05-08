import { ref, onUnmounted } from 'vue'
import { executeClient } from '@/api/rage'

export const RADIO_STATIONS_URLS = [
    'https://radio.redage.net:8000/radio.mp3',
    'https://radio.redage.net:8010/radio.mp3',
    'https://radio.redage.net:8040/radio.mp3',
    'https://radio.redage.net:8050/radio.mp3',
    'https://radio.redage.net:8020/radio.mp3',
    'https://radio.redage.net:8060/radio.mp3',
]

export const RADIO_STATION_NAMES = ['RedAge', 'RedAge Rap', 'RedAge Rock', 'RedAge Phonk', 'RedAge Pop', 'RedAge Chill']

export type RadioPage = 'radio' | 'radioList'

export function useRadio(initialState = false, initialStation = 0) {
    const selectPage = ref<RadioPage>('radio')
    const isToggled = ref(initialState)
    const selectedStation = ref(initialStation)
    const volume = ref(50)

    const enableStation = () => {
        if (selectedStation.value >= RADIO_STATIONS_URLS.length) return
        executeClient('sounds.play2DRadio', RADIO_STATIONS_URLS[selectedStation.value], volume.value / 100)
    }

    const updateToggled = () => {
        isToggled.value = !isToggled.value
        if (!isToggled.value) {
            executeClient('sounds.stop2DRadio')
            return
        }
        enableStation()
    }

    const changeVolume = (delta: number) => {
        const newVol = Math.round(volume.value / 10) + delta
        const clamped = Math.max(0, Math.min(10, newVol))
        volume.value = clamped * 10
        if (isToggled.value) executeClient('sounds.volume2DRadio', volume.value / 100)
    }

    const setRadioStation = (index: number) => {
        if (selectedStation.value === index || index >= RADIO_STATIONS_URLS.length) return
        selectedStation.value = index
        selectPage.value = 'radio'
        enableStation()
    }

    onUnmounted(() => {
        if (!isToggled.value) executeClient('sounds.stop2DRadio')
    })

    return {
        selectPage,
        isToggled,
        selectedStation,
        volume,
        stationNames: RADIO_STATION_NAMES,
        updateToggled,
        changeVolume,
        setRadioStation,
    }
}
