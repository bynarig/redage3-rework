import { ref, onMounted, onUnmounted } from 'vue'
import { executeClientToGroup, executeClientAsyncToGroup } from '@/api/rage'
import { addListernEvent } from '@/api/functions'
import { useDevice } from './useDevice'
import type { ContactItem } from '../types/calls'

export function useSelectContact(refreshContacts: () => void) {
    const device = useDevice()

    const contactData = ref<ContactItem>({} as ContactItem)
    const isEdit = ref(false)
    const nameValue = ref('')
    const avatarValue = ref('')

    const getAvatar = (avatar?: string) => {
        if (avatar && avatar.length > 6) return `background-image: url(${avatar})`
        return ''
    }

    const getContact = () => {
        executeClientAsyncToGroup('getContact', device.selectNumber).then((result) => {
            if (result && typeof result === 'string') contactData.value = JSON.parse(result)
        })
    }

    const onClose = () => { device.selectNumber = null }

    const updateEditStatus = () => {
        nameValue.value = contactData.value.Name
        avatarValue.value = contactData.value.Avatar ?? ''
        isEdit.value = !isEdit.value
    }

    const sendImage = (link: string) => { if (link) avatarValue.value = link }

    addListernEvent('cameraLink', sendImage as (...args: unknown[]) => void)

    const onPopupImage = () => {
        if (device.selectedImage !== undefined && device.selectedImageFunc !== undefined) {
            device.selectedImage = true
            device.selectedImageFunc = sendImage
        }
    }

    const onUpdateContact = () => {
        if (!nameValue.value || nameValue.value.length < 2) {
            ;(window as any).notificationAdd?.(4, 9, 'Имя не может быть меньше 2 символов.', 3000)
            return
        }
        executeClientToGroup('updateContact', device.selectNumber, nameValue.value, avatarValue.value)
        updateEditStatus()
        getContact()
        refreshContacts()
    }

    const onAddBlackList = () => {
        executeClientAsyncToGroup('addBlackList', device.selectNumber).then((result) => {
            if (result) contactData.value.IsBlackList = true
        })
    }

    const onDellBlackList = () => {
        executeClientAsyncToGroup('dellBlackList', device.selectNumber).then((result) => {
            if (result) contactData.value.IsBlackList = false
        })
    }

    const onDellContact = () => {
        executeClientAsyncToGroup('dellContact', device.selectNumber).then((result) => {
            if (result) {
                onClose()
                refreshContacts()
            }
        })
    }

    const onCall = (number: number) => {
        device.selectNumber = number
        executeClientToGroup('call', number)
        device.setPage('callView')
    }

    const onMessage = (number: number) => {
        device.selectNumber = number
        device.setPage('messages')
    }

    const onFocus = () => executeClientToGroup('inputFocus', true)
    const onBlur = () => executeClientToGroup('inputFocus', false)

    onMounted(getContact)
    onUnmounted(() => executeClientToGroup('inputFocus', false))

    return {
        contactData,
        isEdit,
        nameValue,
        avatarValue,
        getAvatar,
        getContact,
        onClose,
        updateEditStatus,
        onPopupImage,
        onUpdateContact,
        onAddBlackList,
        onDellBlackList,
        onDellContact,
        onCall,
        onMessage,
        onFocus,
        onBlur,
    }
}
