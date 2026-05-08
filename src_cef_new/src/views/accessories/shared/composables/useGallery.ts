import { ref, onMounted } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'
import type { GalleryItem } from '../types/gallery'

function formatDatePart(time: string, part: 'date' | 'time'): string {
    if (!time) return ''
    const d = new Date(time)
    if (isNaN(d.getTime())) return ''
    if (part === 'date') return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function useGallery() {
    const data = ref<GalleryItem[]>([])
    const selectedImage = ref<GalleryItem | null>(null)
    const isDeletePopup = ref(false)

    const formatDate = (time: string) => formatDatePart(time, 'date')
    const formatTime = (time: string) => formatDatePart(time, 'time')

    const onDelete = (link: string) => {
        executeClientToGroup('dellGallery', link)
        const idx = data.value.findIndex((a) => a[0] === link)
        if (idx !== -1) data.value.splice(idx, 1)
        selectedImage.value = null
        isDeletePopup.value = false
    }

    const load = () => {
        executeClientAsyncToGroup('getGallery').then((result) => {
            if (result && typeof result === 'string') data.value = JSON.parse(result)
        })
    }

    onMounted(load)

    return { data, selectedImage, isDeletePopup, formatDate, formatTime, onDelete }
}
