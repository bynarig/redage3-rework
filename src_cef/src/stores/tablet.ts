import { defineStore } from 'pinia'
import { createDeviceNavigation } from './deviceStore'

export type TabletPage =
    | 'mainmenu'
    | 'messages'
    | 'maps'
    | 'gallery'
    | 'settings'
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

export const useTabletStore = defineStore('tablet', () => {
    return createDeviceNavigation<TabletPage>({
        groupName: 'tablet',
        keepSelectPage: 'messages',
    })
})
