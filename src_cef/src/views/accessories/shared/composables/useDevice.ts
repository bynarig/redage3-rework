import { provide, inject, type InjectionKey } from 'vue'
import type { IDeviceStore } from '../types/device'

export const DEVICE_KEY: InjectionKey<IDeviceStore> = Symbol('deviceStore')

export function provideDevice(store: IDeviceStore) {
    provide(DEVICE_KEY, store)
}

export function useDevice(): IDeviceStore {
    const store = inject(DEVICE_KEY)
    if (!store) throw new Error('useDevice must be called inside a device provider')
    return store
}
