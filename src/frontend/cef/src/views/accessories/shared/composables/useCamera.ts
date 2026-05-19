import { onMounted } from 'vue'
import { executeClient, executeClientToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { useDevice } from './useDevice'

export function useCamera() {
    const device = useDevice()

    const updateCameraLink = (...args: unknown[]) => {
        const link = args[0]
        if (link && typeof link === 'string') {
            executeClientToGroup('addGallery', link)
        }
        device.setPage('mainmenu')
    }

    onMounted(() => {
        const phoneEl = document.querySelector('.newphone__image')
        if (phoneEl) phoneEl.classList.add('phone__camera')

        setTimeout(() => {
            if (phoneEl) phoneEl.classList.remove('phone__camera')
            executeClient('camera.open')
        }, 150)
    })

    addListernEvent('cameraLink', updateCameraLink)
}
