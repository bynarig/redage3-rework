import { defineStore } from 'pinia'
import { ref } from 'vue'
import { createDeviceNavigation } from './deviceStore'

export type PhonePage =
    | 'mainmenu'
    | 'call'
    | 'callView'
    | 'messages'
    | 'maps'
    | 'gallery'
    | 'camera'
    | 'settings'
    | 'weather'
    | 'taxi'
    | 'cars'
    | 'mech'
    | 'news'
    | 'property'
    | 'radio'
    | 'forbes'
    | 'darknet'
    | 'auction'
    | 'trucker'
    | 'tinder'

export const usePhoneStore = defineStore('phone', () => {
    const nav = createDeviceNavigation<PhonePage>({
        groupName: 'phone',
        keepSelectPage: 'call',
        noHistoryPage: 'callView',
    })

    const isMapLoad = ref(false)
    const isSim = ref(false)
    const currentWeather = ref('thunder')

    return {
        ...nav,
        isMapLoad,
        isSim,
        currentWeather,
    }
})
