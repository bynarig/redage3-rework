import { defineStore } from 'pinia'
import { createDeviceNavigation } from './deviceStore'

export type WatchPage =
    | 'mainmenu'
    | 'homescreen'
    | 'messages'
    | 'maps'
    | 'weather'
    | 'radio'
    | 'taxi'
    | 'cars'
    | 'mech'
    | 'news'
    | 'property'
    | 'forbes'
    | 'auction'
    | 'tinder'
    | 'trucker'
    | 'settings'
    | 'activity'

export const useWatchStore = defineStore('watch', () => {
    return createDeviceNavigation<WatchPage>({
        groupName: 'watch',
        keepSelectPage: 'messages',
    })
})
