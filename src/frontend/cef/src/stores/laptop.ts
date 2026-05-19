import { defineStore } from 'pinia'
import { createDeviceNavigation } from './deviceStore'

export type LaptopPage =
    | 'mainmenu'
    | 'messages'
    | 'maps'
    | 'gallery'
    | 'camera'
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
    | 'support'
    | 'browser'

export const useLaptopStore = defineStore('laptop', () => {
    return createDeviceNavigation<LaptopPage>({
        groupName: 'laptop',
        keepSelectPage: 'messages',
    })
})
