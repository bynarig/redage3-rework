import { ref } from 'vue'
import { defineStore } from 'pinia'

export interface GameNotification {
    id: number
    type: number
    icon: number
    text: string
    duration: number
}

export const useNotificationStore = defineStore('notification', () => {
    const items = ref<GameNotification[]>([])
    let _nextId = 0

    function add(type: number, icon: number, text: string, duration: number) {
        const id = _nextId++
        items.value.push({ id, type, icon, text, duration })
        setTimeout(() => remove(id), duration)
    }

    function remove(id: number) {
        const idx = items.value.findIndex((n) => n.id === id)
        if (idx !== -1) items.value.splice(idx, 1)
    }

    return { items, add, remove }
})
